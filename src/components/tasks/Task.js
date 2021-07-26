import React from 'react'
import { Card, CardHeader, CardContent, IconButton, Typography, Avatar, Box, Divider } from '@material-ui/core'
import { DeleteOutlined } from '@material-ui/icons'
import moment from 'moment'
import { useTask } from '../../contexts/TaskContext'

const Task = ({ task }) => {
    //delete task function from context
    const { deleteTask } = useTask()

    return (
        <Card>
            <CardHeader
                action={
                    <IconButton onClick={() => deleteTask(task.id)}>
                        <DeleteOutlined />
                    </IconButton>
                }
                title={task.title}
                subheader={"Due at " + moment(task.due.toDate()).format('MMMM Do YYYY h:mma')}
            />
            <Divider />
            <CardContent>
                <Typography inline variant="body2" color="textSecondary" gutterBottom>
                    {task.description}
                </Typography>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="center">
                <Box m={1.5}>
                    <Typography variant="h6" color="textSecondary">${task.amount} to {task.to.displayName}</Typography>
                </Box>
                <Box m={1.5}>
                    <Avatar src={task.to.photoURL}/>
                </Box>
            </Box>
        </Card>
    )
}

export default Task
