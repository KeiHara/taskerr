import { Grid, Card, TextField, CardContent, Typography, Avatar, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useTask } from '../../contexts/TaskContext'

//styles for background
const useStyles = makeStyles(theme => ({
    button: {
        background: theme.palette.primary.mainGradient
    },
    name: {
        marginLeft: theme.spacing(5),
    },
}))

const AddTask = () => {
    const classes = useStyles()
    const { currentUser } = useAuth()
    const { user, users, usersLoading } = useTask()

    //states for form
    const [selectedUser, setSelectedUser] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(0)
    const [dateTime, setDateTime] = useState(new Date())
    const history = useHistory()
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [amountError, setAmountError] = useState(false)
    const [dateTimeError, setDateTimeError] = useState(false)

    // addtask function from context
    const { addTask } = useTask()

    

    const balance = user ? user.balance : 0

    const submitHandler = async (e) => {
        e.preventDefault()

        //form validation
        if (amount < 0 || amount > balance) {
            console.log(amount)
            setAmountError(true)
            return
        }
        if (title === '') {
            setTitleError(true)
            return
        }
        if (description === '') {
            setDescriptionError(true)
            return
        }
        
        if (dateTime === null) {
            setDateTimeError(true)
            return
        }

        const task = {
            author: user,
            title,
            description,
            amount,
            due: moment(dateTime).toDate(),
            to: selectedUser,
        }

        //trigger addtask function
        if (title && description && ((amount > 0) && (amount <= balance)) && dateTime && selectedUser) {
            addTask(task)
            history.push('/')
        }
    }

    return (
        
        <Grid
            container
            justifyContent="center"
        >
            {/* I think this header could be written better */}
            <Grid item xs={8}>
                <Typography
                variant="h4"
                color="inherit"
                gutterBottom
                    component="h1"
                    >Add Task</Typography>
            </Grid>
            
            {/* Form */}
            <Card>
                <CardContent>
                    <form onSubmit={submitHandler} noValidate autoComplete="off">
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                xs={6}
                                item
                            >
                                <TextField
                                    label="Title" 
                                    fullWidth
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    error={titleError}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                item
                            >
                                <TextField
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="filled"
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                    error={descriptionError}
                                />
                            </Grid>
                            <Grid
                                xs={6}
                                item
                            >
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DateTimePicker
                                    color="primary"
                                    label="Due Date"
                                    value={dateTime}
                                    disablePast
                                    animateYearScrolling
                                    fullWidth
                                    inputVariant="filled"
                                    onChange={(date) => setDateTime(date)}
                                    error={dateTimeError}
                                    minutesStep={15}
                                />
                            </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid
                                xs={6}
                                item
                            >
                                <TextField
                                    label="Amount"
                                    type="number"
                                    fullWidth
                                    defaultValue={amount}
                                    variant="filled"
                                    onChange={(event) =>
                                        event.target.value < 0
                                            ? (event.target.value = 0)
                                            : setAmount(parseInt(event.target.value))
                                    }
                                    InputProps={{
                                        inputProps: { 
                                            max: currentUser.balance, min: 0
                                        }
                                    }}
                                    required
                                    error={amountError}
                                />
                            </Grid>
                            <Grid container justifyContent="center" xs={12} item>
                            {!usersLoading ?
                                <Grid xs={12} item>
                                    <Autocomplete
                                        required
                                        id="combo-box-demo"
                                        options={users.filter(user => user.uid !== currentUser.uid)}
                                        getOptionLabel={option => option.email}
                                        renderInput={parms => (
                                            <TextField
                                                {...parms}
                                                label="Send money to..."
                                                variant="outlined"
                                                disablepast="true"
                                            />
                                        )}
                                        renderOption={option => {
                                            return (
                                                <Grid container><Avatar src={option.photoURL} /><Typography className={classes.name}>{option.displayName}</Typography></Grid>
                                            )
                                        }}
                                        onChange={(event, newValue) => {
                                            setSelectedUser(newValue);
                                        }}
                                    />
                                </Grid>
                                    :
                                <Grid>
                                    <CircularProgress />
                                </Grid>
                            }
                            </Grid>
                            <Grid container justifyContent="center" item xs={12}>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    size='large'
                                    color="primary"
                                    type="submit"
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </form> 
                </CardContent>
            </Card>
        </Grid>
    )
}

export default AddTask
