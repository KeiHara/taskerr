import React, { useContext, createContext } from 'react'
import firebase, { auth, firestore } from '../config/fbconfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore' 
const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUser, authLoading] = useAuthState(auth)  //fetch current user from firebase auth

    //fetch current user's profile from firebase firestore
    const userRef = currentUser && firestore.collection('users').doc(currentUser.uid)
    const [user] = useDocumentData(userRef) 

    //sign in function
    const signIn = () => {
        auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    }

    //signout function
    const signOut = () => {
        auth.signOut()
    }

    //withdraw function
    const withdraw = amount => {
        userRef.update({
            balance: firebase.firestore.FieldValue.increment(-amount)
        })
    }
    
    const authProvider = {
        currentUser,
        authLoading,
        signIn,
        signOut,
        user,
        withdraw
    }

    return (
        <AuthContext.Provider value={authProvider}>
            {children}
        </AuthContext.Provider>  
    )
}
