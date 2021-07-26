import { Box, CircularProgress } from "@material-ui/core"
import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
    root: {
        background: "linear-gradient(315deg, #000000 0%, #414141 74%)",
        minHeight: '100vh',
    }
    
})

const AuthLoading = () => {
    const classes = useStyles()
    return (
        <Box className={classes.root} display="flex">
            <Box m="auto">
                <CircularProgress />
            </Box>
        </Box>
    )
}

export default AuthLoading
