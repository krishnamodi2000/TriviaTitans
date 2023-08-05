import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { GoogleButton } from 'react-google-button';
import './main.css';
import { addUserProfile } from '../user-profile-api';

const Register = () => {
  const navigate = useNavigate();
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords are not matching!")
    }

    try {
      setError('')
      setLoading('true')
      const userCredential = await createUserWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      const user = userCredential.user;
      console.log(user);
      //save user data on user profile
      const userProfileData = { 
        contactnumber: ' ', 
        totalgamepoint: '0', 
        totalgamesplayed: '0',
        userid: user.uid, 
        username: ' ', 
        userprofileurl: ' ', 
        winlossratio: '0'
      };
      const response = await addUserProfile(userProfileData);
      console.log(response);
      navigate('/registerSuccessRedirect');
    } catch (error) {
      return setError(error.message);
    }

    setLoading('false')
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((data) => {
        const userEmail = data.user.email;
        emailRef.current.value = userEmail;
        navigate('/loginMFAAuth');
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="form">
      <h2>Trivia Game Registration Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <form>
        <input
          type="email"
          ref={emailRef}
          required
          placeholder="Email address"
        />
        <input
          type="password"
          ref={passwordRef}
          required
          placeholder="Password"
        />
        <input
          type="password"
          ref={confirmPasswordRef}
          required
          placeholder="Confirm Password"
        />

        <button type="submit" onClick={onSubmit}>Register</button>
      </form>
      <p>Already have an account?{' '}<NavLink to="/login">Sign in</NavLink></p>
      <div className="facebook-button" >
        <span className="facebook-icon">
          <i className="fab fa-facebook-f"></i>
        </span>
        Sign Up with Facebook
      </div>
      <div className="button" onClick={signInWithGoogle}><GoogleButton /></div>
      <iframe
        src="https://d237pstd9kt2he.cloudfront.net"
        title="Chatbot"
        width="100%"
        height="500px"
      />
    </div>
  );
};

export default Register;
