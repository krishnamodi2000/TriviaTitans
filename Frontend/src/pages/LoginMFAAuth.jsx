import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Alert,
} from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const questions = [
  'In which city were you born?',
  'What is your mother\'s maiden name?',
  'What year was your father born?',
  'What is your favourite color?',
];

const LoginMFAAuth = () => {
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const answerRef = useRef();
  const [error, setError] = useState('');
  const [wrongAttempts, setWrongAttempts] = useState(0); 
  const { currentUser, logout } = useAuth(); 

  useEffect(() => {
    generateRandomQuestion();
  }, []);

  const generateRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setQuestionIndex(randomIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      'question': questions[questionIndex],
      'answer': answerRef.current.value
    };

    const config = {
      headers: {  
        'content-type': 'application/json',
        'token': currentUser.accessToken
      }
    };

    try {
      setError('');
      console.log(config)
      const response = await axios.post('https://mqpjoegrxe.execute-api.us-east-1.amazonaws.com/dev/user/authenticateUser', data, config);
      console.log('POST response:', response.data);
      if ('group' in response.data) {
        const groupValue = response.data.group;
        if (groupValue === 'user') {
          navigate('/Homepage'); // Redirect to user dashboard if the 'group' value is 'user'
          // console.log(currentUser);
        } else {
          navigate('/adminLandingPage'); // Redirect to admin dashboard if the 'group' value is 'admin'
        } 
      }
    } catch (error) {
      console.log(error)
      // Handle wrong answer
      setWrongAttempts(prevAttempts => prevAttempts + 1); // Increment wrong attempts
      if (wrongAttempts >= 2) { // If three or more wrong attempts
        await logout()
        navigate("/login")
      } else {
        setError(error.response.data.message);
      }
    }
  };

  return (
    // <div className='form'>
    //   <h2>Please answer below question to proceed further.</h2>
    //   {error && <Alert variant="danger">{error}</Alert>}
    //   {/* {currentUser.accessToken} */}
    //   <form onSubmit={handleSubmit}>
    //     <label htmlFor="q">{questions[questionIndex]}</label>
    //     <input
    //       id='q'
    //       type="text"
    //       ref={answerRef}
    //       required
    //     />
    //     <button type="submit">Submit</button>
    //   </form>
    // </div>
    <Box className="form">
    <Heading as="h3" size='md'>Please answer the question below to proceed further.</Heading>
    {error && <Alert status="error">{error}</Alert>}
    <br />
    <form onSubmit={handleSubmit}>
      <FormControl isRequired >
        <FormLabel htmlFor="q">{questions[questionIndex]}</FormLabel>
        <Input variant='filled' id="q" type="text" ref={answerRef} />
      </FormControl>
      <Button colorScheme='green' type="submit">Submit</Button>
    </form>
  </Box>
  );
};

export default LoginMFAAuth;
