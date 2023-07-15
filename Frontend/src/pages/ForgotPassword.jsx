import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth' 

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const sendResetPasswordEmail = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        window.alert('Password reset email has been sent!');
        navigate('/login');
      } catch (error) {
        console.log('Error sending password reset email:', error);
      }
    } else {
      window.alert('Please enter your email address.');
    }
  };

  return (
    <div className="form">
      <h2>Trivia Game Login Page</h2>
      <form>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
        />

        <button type="button" onClick={sendResetPasswordEmail}>
          Send Email
        </button>
      </form>
      <p>
        Login? <NavLink to="/login">Login</NavLink>
      </p>
    </div>
  );
};

export default ForgotPassword;
