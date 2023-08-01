import React, { Fragment } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import RegisterSuccessRedirect from './pages/RegisterSuccessRedirect';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLandingPage from './pages/AdminLandingPage';
import LoginMFAAuth from './pages/LoginMFAAuth';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext"
 
function App() {
 
  return (
    <Router>
      <AuthProvider>
      <div>
        <section>
          <Fragment>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route exact path='/' element={<PrivateRoute/>}>
                <Route path="/registerSuccessRedirect" element={<RegisterSuccessRedirect/>}/>
                <Route path="/loginMFAAuth" element={<LoginMFAAuth />} />
                <Route path="/userDashboard" element={<UserDashboard />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/adminLandingPage" element={<AdminLandingPage />} />
                <Route path="/userProfile" element={<UserProfile />} />
            </Route>
            <Route path="/forgotPassword" element={<ForgotPassword />} />
          </Routes>
          </Fragment>
        </section>
      </div>
      </AuthProvider>
    </Router>
   
  );
}

export default App;
