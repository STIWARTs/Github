import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages List--importing all the (4)components that will be used in the routes
import Dashboard from "./components/dashboard/dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

//Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
    const {currentUser, setCurrentUser} = useAuth(); // if user not logged in, currentUser will be null
    const navigate = useNavigate();// useNavigate is a hook that returns a function that lets you navigate programmatically

    useEffect(() => { //hook or function called when the component mounts/render first time
        //what should happen when the component mounts/initialCall
        const userIdFromStorage = localStorage.getItem('userId'); //get userId from local storage--means user logged in
        //when user logged in, we gave him userId and jwt token, 
        //now we check if userId is present in local storage or not
        if (userIdFromStorage && !currentUser) { //if userId is present in local storage(already logged in),then set currentUser to userId from local storage
            setCurrentUser(userIdFromStorage); //set currentUser to userId from local storage
        }

        if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
            //if userId is not present in local storage and current path is not /auth or /signup, then redirect to /auth
            navigate("/auth"); //redirect to /auth page
        }

        if(userIdFromStorage && (window.location.pathname === "/auth" || window.location.pathname === "/signup")) {
            //if userId is present in local storage or already signed up, and trying to go /auth or /signup then redirect to /dashboard
            navigate("/"); //redirect to / route dashboard page
        }
    }, [setCurrentUser, currentUser, navigate]); //dependencies - when setCurrentUser or currentUser changes(any of 3 changes), this effect(useffect) will run again(page reloads/re-renders)

    //Routes - this is the main component that decides which route to render based on the current path
    let element = useRoutes([ //useRoutes is a hook(also available in react-dom) that returns an array of routes(with their corresponding components) as list of objects
        {
            path: "/",
            element: <Dashboard />, //if path is /, then render Dashboard component
        },
        {
            path: "/auth",
            element: <Login />, //if path is /auth, then render Login component
        },
        {
            path: "/signup",
            element: <Signup />, //if path is /signup, then render Signup component
        },
        {
            path: "/profile",   
            element: <Profile />, //if path is /profile, then render Profile component
        }
    ]);
    return element; //return the element that was created by useRoutes
}

export default ProjectRoutes; //export the ProjectRoutes component so it can be used in main.jsx