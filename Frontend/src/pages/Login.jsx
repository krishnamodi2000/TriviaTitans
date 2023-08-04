import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import { Alert } from 'react-bootstrap';
import { auth, googleProvider } from '../firebase';
import { GoogleButton } from 'react-google-button';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Alert,
  Link,
} from "@chakra-ui/react";

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
    // <div className="form">
    //   <h2>Trivia Game Login Page</h2>
    //   {error && <Alert variant="danger">{error}</Alert>}
    //   <form>
    //       <input
    //         type="email"
    //         ref={emailRef}
    //         required
    //         placeholder="Email address"
    //       />

    //       <input
    //         type="password"
    //         ref={passwordRef}
    //         required
    //         placeholder="Password"
    //       />

    //     <button type="submit" onClick={onSubmit}>Sign In</button>
    //   </form>
    //   <p>Don't have an account? <NavLink to="/register">Register</NavLink></p>
    //   <p><NavLink to="/forgotPassword">Forgot Password?</NavLink></p>
    //   <div className="button" onClick={signInWithGoogle}><GoogleButton /></div>
    // </div>

    // Test
    <Box className="form">
      <Heading as="h2" paddingBottom={"10px"}>Trivia Game Login Page</Heading>
      {error && <Alert status="error">{error}</Alert>}
      <form>
        <FormControl isRequired>
          <FormLabel>Email address</FormLabel>
          <Input type="email" ref={emailRef} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" ref={passwordRef} />
        </FormControl>

        <Button type="submit" colorScheme='green' onClick={onSubmit}>
          Sign In
        </Button>
      </form>
      <p>
        Don't have an account? <NavLink to="/register">Register</NavLink>
      </p>
      <p>
        <NavLink to="/forgotPassword">Forgot Password?</NavLink>
      </p>
      <Box className="button" onClick={signInWithGoogle}>
        <GoogleButton />
      </Box>
    </Box>

  );
};

export default Login;
