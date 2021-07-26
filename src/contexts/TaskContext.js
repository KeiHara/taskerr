import React, { useContext, createContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { firestore } from '../config/fbconfig'
import { useAuth } from './AuthContext'
const TaskContext = createContext()

export const useTask = () => {
    return useContext(TaskContext)  
}

export const TaskProvider = ({ children }) => {

    //get current user and user profile from context
    const { currentUser } = useAuth()
    const { user } = useAuth()

    //fetch users from firebase firestore
    const usersRef = firestore.collection('users')
    const [users, usersLoading] = useCollectionData(usersRef)


    //add task function
    const addTask = (task) => {
        const taskRef = firestore.collection('tasks')
        taskRef.add(task).then(
            task.template = "onCreate"
        )

        //add document to emails collection
        const emailRef = firestore.collection('emails') 
        emailRef.add(task)  
    }

    //fetch tasks from firebase firestore
    const tasksRef = firestore.collection('tasks').where("author.uid", "==", currentUser.uid).orderBy('due')
    const [tasks, tasksLoading] = useCollectionData(tasksRef, { idField: 'id' })

    //fetch received tasks from firebase firestore
    const receivedTasksRef = firestore.collection('tasks').where("to.uid", "==", currentUser.uid).orderBy('due')
    const [receivedTasks, receivedTasksLoading] = useCollectionData(receivedTasksRef)

    //delete task function
    const deleteTask = async (taskId) => {
        const taskRef = firestore.collection('tasks').doc(taskId)
        const doc = await taskRef.get()
        const task = doc.data()

        //add document to emails collection
        task.template = "onDone"
        firestore.collection('emails').add(task)
            .then(
                taskRef.delete()
            )
        
    }

    const TaskProvider = {
        addTask,
        tasks,
        tasksLoading,
        deleteTask,
        receivedTasks,
        receivedTasksLoading,
        user,
        users,
        usersLoading,
    }

    return (
        <TaskContext.Provider value={TaskProvider}>
            {children}
        </TaskContext.Provider>  
    )
}
