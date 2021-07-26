import React from 'react'
import { Container, Typography } from '@material-ui/core'
import { useTask } from '../../contexts/TaskContext'
import Task from './Task'
import Masonry from 'react-masonry-css'
const Tasks = () => {
    const { tasks, tasksLoading } = useTask()

    const breakpoints = { //Break points for Masonry
        default: 3,
        1920: 4,
        1280: 3,
        960: 2,
        600: 1,
    }
    return (
        <Container>
            <Typography
                variant="h4"
                gutterBottom
            >
                My Tasks
            </Typography>
            {(tasksLoading) ?
                <div>loading</div>
            :
            [
                (tasks.length > 0) ?
                    <Masonry
                        breakpointCols={breakpoints}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                        key={0}
                    >
                        {tasks.map((task, index) => (
                            <div key={index}>
                                <Task task={task}/>
                            </div>
                        ))}
                    </Masonry>
                        :
                    <Typography key={0}>No task to show</Typography>
            ]
            }
        </Container>
    )
}

export default Tasks
