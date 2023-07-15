import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';
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
  const { currentUser } = useAuth()

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
      'answer': answerRef.current.value,
      'email': currentUser.email,
      'userId': currentUser.uid
    };

    const config = {
      headers:{
        'content-type': 'application/json',
        'token': currentUser.accessToken
      }
    };

    try {
      setError('')
      const response = await axios.post('https://e3cuaczgn5fpbkrrd24gtmkvze0jwquv.lambda-url.us-east-1.on.aws/', data, config);
      console.log('POST response:', response.data);
      //get the group and redirect to corresponding page
      console.log('Success');
      navigate('/userDashboard')
    } catch (error) {
      return setError(error.response.data);
    }
  };

  return (
    <div className='form'>
      <h2>Please answer below question to proceed further.</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="q">{questions[questionIndex]}</label>
        <input
          id='q'
          type="text"
          ref={answerRef}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LoginMFAAuth;
