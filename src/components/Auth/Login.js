import { Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'



const useStyles = makeStyles((theme) => ({  //custom styles
    root: {
        background: theme.palette.background.default,
        minHeight: '100vh',
    },
    button: {
        background: theme.palette.primary.mainGradient
    }
}))

const Login = () => {
    const classes = useStyles()
    const { signIn } = useAuth()
    return (
        <Grid className={classes.root} container justifyContent="center" alignItems="center">
            <Button size='large' disableElevation className={classes.button} onClick={() => signIn()} variant='contained' color='primary'>SignIn with Google</Button>
        </Grid>
    )
}

export default Login
