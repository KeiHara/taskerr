import React, { useState } from 'react'
import { Card, CardHeader, CardContent, Typography, Avatar, Box, Divider, Checkbox, Fade } from '@material-ui/core'
import moment from 'moment'
import { useTask } from '../../contexts/TaskContext'

const Task = ({ task }) => {
    //delete task function from context
    const { deleteTask } = useTask()
    const [checked, setChecked] = useState(false)
    if (checked) {
        deleteTask(task.id)
    }

    return (
        <Fade in={!checked}>
            <Card>
                <CardHeader
                    action={
                        <Checkbox
                            color="primary"
                            checked={checked}
                            onChange={() => setChecked  (!checked)}
                        />
                    }
                    title={task.title}
                    subheader={"Due at " + moment(task.due.toDate()).format('MMMM Do YYYY   h:mma')}
                />
                <Divider />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        {task.description}
                    </Typography>
                </CardContent>
                <Divider />
                <Box display="flex" justifyContent="center">
                    <Box m={1.5}>
                        <Typography variant="h6" color="textSecondary">${task.amount} to {task.to.displayName}  </Typography>
                    </Box>
                    <Box m={1.5}>
                        <Avatar src={task.to.photoURL}/>
                    </Box>
                </Box>
            </Card>
        </Fade>    
    )
}

export default Task
