import React from 'react'
import ReceivedTask from './ReceivedTask'
import { useTask } from '../../contexts/TaskContext'
import { Container, Typography } from '@material-ui/core'
import Masonry from 'react-masonry-css'
const ReceivedTasks = () => {
    const { receivedTasks, receivedTasksLoading } = useTask()

    const breakpoints = { //break points for Masonry
        default: 3,
        1920: 4,
        1280: 3,
        960: 2,
        600: 1,
    }
    return (

        // same as Tasks.js
        <Container>
            <Typography
                variant="h4"
                gutterBottom
            >
                Received Tasks
            </Typography>
            {/* Check if fetching data from firebase */}
            {   
                (receivedTasksLoading) ?
                    // replace it with material-ui loading thingy
                    <div>loading</div>
                    :
                [
                    (receivedTasks.length > 0) ?
                        <Masonry
                            breakpointCols={breakpoints}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {receivedTasks.map((task, index) => (
                                <div key={index}>
                                    <ReceivedTask task={task}/>
                                </div>
                            ))}
                        </Masonry>
                    :
                        <Typography key={0}>No received task</Typography>
                ]
                    
            }
        </Container>
    )
}

export default ReceivedTasks
