import { Button, Grid, Typography, Fade, Slide } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { useState, useEffect } from 'react'
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
    const [checked, setChecked] = useState(false)
    const [disable, setDisable] = useState(false)
    const onClick = () => {
        setDisable(true)
        signIn()
    }

    useEffect(() => {
        setChecked(true)
    },[]);

    return (
        <Grid 
            className={classes.root} 
            container 
            justifyContent="center" 
            alignItems="center"
            direction="column"
            spacing={3}
        >
            <Grid item xs={12}>
                <Fade
                    in={checked}
                    timeout={{ enter: 1000 }}
                >
                    <Typography 
                        variant="h1"
                        color="textPrimary"
                    >
                        Taskerr
                    </Typography>
                </Fade>
            </Grid>
            <Grid item xs={12}>
                <Slide
                    direction="up"
                    in={checked}
                    timeout={1000}
                >
                    <div>
                        <Fade
                            in={checked}
                            timeout={2000}
                        >
                            <Button 
                                size='large'  
                                disableElevation 
                                className={classes.button} 
                                onClick={() => onClick()} 
                                variant='contained' 
                                color='primary'
                                disabled={disable}
                            >
                                SignIn with Google
                            </Button>
                        </Fade>
                    </div>
                </Slide>
            </Grid>
        </Grid>
    )
}

export default Login
