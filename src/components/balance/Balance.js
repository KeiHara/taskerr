import React, { useState } from 'react'
import firebase from '../../config/fbconfig'
import { useStripe } from '@stripe/react-stripe-js'
import { Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import { useAuth } from '../../contexts/AuthContext'

const useStyles = makeStyles(theme => ({  //custom styles
    button: {
        background: theme.palette.primary.mainGradient
    },
}))

const Balance = () => {
    const classes = useStyles()
    const stripe = useStripe();
    const { user } = useAuth()          //get user's propertiy from context
    const stripeCustomerId = user && user.stripeCustomerId        
    const { withdraw } = useAuth()      //withdraw function from context

    //states for form
    const [amount, setAmount] = useState(0);          
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [clicked, setClicked] = useState(false);
    const [amountError, setAmountError] = useState(false);
    const [withdrawError, setWithdrawError] = useState(false);

    //call firebase on call function
    const createStripeCheckout = firebase.functions().httpsCallable('createStripeCheckout');

    //make payment intent and redirect to stripe checkout session
    const checkout = () => {
        if (amount < 0) {           //form validation
            setAmountError(true)
            return
        }
        setClicked(true)


        createStripeCheckout({ amount, stripeCustomerId })   //redirect stripe checkout session
            .then(res => {
                const sessionId = res.data.id
                stripe.redirectToCheckout({ sessionId })
            })
    }

    //withdraw function
    const withdrawCheck = (withdrawAmount) => {
        if (withdrawAmount < 0) { //form validation
            setWithdrawError(true)
            return
        }
        if (withdrawAmount > user.balance) {
            setWithdrawError(true)
            return
        }

        withdraw(withdrawAmount)
        setWithdrawError(false)
        setWithdrawAmount(0)
    }
    

    return (
        <Grid
            container
            justifyContent="center"
            direction="column"
            alignItems="center"
            spacing={2}
        >
            {/* deposit form */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Grid
                            item
                            container
                            justifyContent="center"
                            direction="column"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item xs={12}>
                                <TextField
                                        id="amount"
                                        label="Deposit  Amount"
                                        type="number"
                                        fullWidth
                                        value={amount}
                                        onChange={(e)=> setAmount(e.target.value)}
                                        error=  {amountError}
                                        required

                                />
                            </Grid>
                            <Grid container justifyContent="center" item xs={12}>
                                <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        type="submit"
                                        onClick={checkout}
                                        className={classes.button}
                                        disabled={clicked}
                                >
                                    Deposit
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            {/* Withdraw form */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Grid
                            item
                            container
                            justifyContent="center"
                            direction="column"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item xs={12}>
                                <TextField
                                    id="amount"
                                    label="Withdraw Amount"
                                    type="number"
                                    fullWidth
                                    value={withdrawAmount}
                                    onChange={(e)=>setWithdrawAmount(e.target.value)}
                                    required
                                    error={withdrawError}
                                />
                            </Grid>
                            <Grid container justifyContent="center" item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    type="submit"
                                    onClick={()=>withdrawCheck(withdrawAmount)}
                                    className={classes.button}
                                >
                                    Withdraw
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Balance
