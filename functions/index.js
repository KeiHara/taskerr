const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.userJoined = functions.auth.user()
    .onCreate(async user => {
        //store stripe api secret_key on firebase functions config
        const stripe = require("stripe")(functions.config().stripe.secret_key);
        const stripeCustomer = await stripe.customers.create({
            email: user.email,
        });
        userDoc = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            balance: 0,
            stripeCustomerId: stripeCustomer.id,
        }
        return admin.firestore().collection('users').doc(user.uid).set(userDoc).then(() => {
            console.log('User joined');
        }).catch((error) => {
            console.log(error);
        });
    });

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
    //store stripe api secret_key on firebase functions config
    const stripe = require("stripe")(functions.config().stripe.secret_key);
    const session = await stripe.checkout.sessions.create({
        client_reference_id: context.auth.uid,
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `https://taskerr-c3026.web.app/success`,
        cancel_url: `https://taskerr-c3026.web.app/deposit`,
        customer: data.stripeCustomerId,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: (100) * data.amount,
                    product_data: {
                        name: "Deposit",
                    },
                },
            },
        ],
    });

    return {
        id: session.id,
    };
});


exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const stripe = require("stripe")(functions.config().stripe.secret_key);
    let event;

    try {
        //store stripe api secret key on firebase functions config
        const whSec = functions.config().stripe.webhook_secret;
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.headers["stripe-signature"],
            whSec
        )
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
    
    if (event.type === "checkout.session.completed") {
        const dataObject = event.data.object
        console.log(dataObject.id)
        const userRef = admin.firestore().collection('users').doc(dataObject.client_reference_id)
        await userRef.update({
            balance: admin.firestore.FieldValue.increment(dataObject.amount_total / 100),
        })
        res.json({ received: true });
    } else if (event.type === "checkout.session.async_payment_failed") {
        console.log("Async payment failed")
        res.redirect("http://localhost:3000/deposit")
    }
    
})
    

exports.sendMoney = functions.runWith({ memory: '2GB' }).pubsub
    .schedule('*/15 * * * *').onRun(async () => {
        const now = new Date()
        const minutesToAdd = 15
        const futureDate = new Date(now.getTime() + minutesToAdd * 60000)
        console.log(futureDate)
        const query = admin.firestore().collection('tasks').where("due", "<=", futureDate);
        const tasks = await query.get();
        tasks.forEach(async doc => {
            const task = doc.data();
            console.log("due:", Date(task.due))
            const toRef = admin.firestore().collection('users').doc(task.to.uid);
            const authorRef = admin.firestore().collection('users').doc(task.author.uid);
            await toRef.update({
                balance: admin.firestore.FieldValue.increment(task.amount)
            })
            await authorRef.update({
                balance: admin.firestore.FieldValue.increment(-task.amount)
            })
            await admin.firestore().collection('tasks').doc(doc.id).delete().then(() => {
                console.log("deleted task")
            })

            task.template = "onExpire"
            await admin.firestore().collection('emails').add(task)
        })
        
    });


exports.sendEmail = functions.firestore.document('emails/{emailId}').onCreate(async (change, context) => {
    const sgMail = require('@sendgrid/mail');
    const moment = require('moment')
    //store sendgrid api key on firebase functions config
    const sgAPI = functions.config().sendgrid.key;
    sgMail.setApiKey(sgAPI);
    const postSnap = await admin.firestore().collection('emails').doc(context.params.emailId).get();
    const post = postSnap.data();

    switch (post.template) {
        case "onCreate":
            var template_id = 'd-b53be0c9c1284a228f823689325792b3'
            break;
        case "onExpire":
            var template_id = 'd-24126b2d2e954c4d854b138b8548f4c8'
            break;
        case "onDone":
            var template_id = "d-73f6700fb96947679661c49d3db55968"
            break;
    }

    const email = {
        to: post.to.email,
        from: post.author.email,
        template_id,
        dynamic_template_data: {
            toDisplayName: post.to.displayName,
            authorDisplayName: post.author.displayName,
            taskTitle: post.title,
            taskDescription: post.description,
            amount: post.amount,
            due: moment(post.due.toDate()).format('MMMM Do YYYY h:mma')
        }
    }

    await sgMail.send(email);

    return { success: true }
});
