import React, {createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext(); //its a constructor function from createContext coming form react,,,that available to all the components in the app(its a global data item)--used for authentication

//User data saves into local storage when they login-->jwt token and user id return from backend),,,every time user wants to access any route, we check if userId is present in local storage or not---for check we making context(making custom hook called as useAuth)
export const useAuth = ()=>{//custom hook - this is a custom hook that will be used to access the auth context in any component that needs it
    return useContext(AuthContext);
}

export const AuthProvider = ({children})=>{ //logic --this is a provider component that will wrap around the app to provide auth context to all components
    const [currentUser, setCurrentUser] = useState(null); //currentUser(by default null) - user id of the user who is currently logged in, setCurrentUser - function to update the currentUser state
    useEffect(()=>{ //useEffect(every times compo trying load useEffect runs) - runs when the component mounts, it checks if userId is present in local storage
        const userId = localStorage.getItem('userId');//when user login, we save userId in local storage, so we can access it later
        if(userId){ //if userId is present in local storage, we set it as the current user available in the app
            setCurrentUser(userId);
        }
    }, []);//empty dependency array means this effect runs only once when the component mounts(mounts means when the component is first rendered)

    const value = { //value - this is the value that will be provided to all components that use this context
        currentUser, setCurrentUser
    } //exported as useAuth, so we can use it in any component that needs access to the auth context--when user logs in, we set the currentUser state to the userId from local storage, and when user logs out, we set it to null

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}