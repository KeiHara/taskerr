import React from 'react'
import { Card, CardHeader, CardContent, Typography, Avatar, Box, Divider } from '@material-ui/core'
import moment from 'moment'

const ReceivedTask = ({ task }) => {
    return (

        // basically same as Task.js
        <Card>
            <CardHeader
                avatar={
                    <Avatar src={task.author.photoURL}/>
                }
                title={task.title}
                subheader={"Due at " + moment(task.due.toDate()).format('MMMM Do YYYY h:mma')}
            />
            <Divider />
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    {task.description}
                </Typography>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="center">
                <Box m={1.5}>
                    <Typography variant="h6" color="textSecondary">{task.author.displayName} will pay ${task.amount}</Typography>
                </Box>
            </Box>
        </Card>
    )
}

export default ReceivedTask
