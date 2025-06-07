import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' //not used in this file
import './index.css'
import { AuthProvider } from './authContext.jsx'
import ProjectRoutes from './Routes.jsx';
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider> // Provide the AuthContext to the entire app
    <Router> 
      {/* <App /> */}
      <ProjectRoutes />//This compo decides/controls which route user to go,,//To check if the user is authenticated and to handle routing//1st loading component that will be rendered when the app loads--controlles rest o the routing of the app based on the user's authentication status
    </Router>
  </AuthProvider>
);
