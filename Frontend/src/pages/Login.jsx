import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Alert } from 'react-bootstrap';
import { auth, googleProvider } from '../firebase';
import { GoogleButton } from 'react-google-button';
import FacebookLogin from 'react-facebook-login';

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);
      navigate('/loginMFAAuth');
    } catch (error) {
      return setError(error.message);
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((data) => {
        const userEmail = data.user.email;
        emailRef.current.value = userEmail;
        navigate('/loginMFAAuth');
      })
      .catch((error) => {
        return setError(error.message);
      });
  };

  return (
    <div className="form">
      <h2>Trivia Game Login Page</h2>
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

        <button type="submit" onClick={onSubmit}>Sign In</button>
      </form>
      <p>Don't have an account? <NavLink to="/register">Register</NavLink></p>
      <p><NavLink to="/forgotPassword">Forgot Password?</NavLink></p>
      <div className="button" onClick={signInWithGoogle}><GoogleButton /></div>
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

export default Login;
