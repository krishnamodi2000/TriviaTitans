import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterSuccessRedirect = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const cityRef = useRef();
  const motherNameRef = useRef();
  const colorRef = useRef();
  const nameRef = useRef();
  const fatherBornYearRef = useRef();
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Create an object with the question answers
    const data = {
      'questions': {
        'In which city were you born?': cityRef.current.value,
        'What is your mother\'s maiden name?': motherNameRef.current.value,
        'What year was your father born?': fatherBornYearRef.current.value,
        'What is your favourite color?': colorRef.current.value,
      },
      'name': nameRef.current.value
    };

    const config = {
      headers:{
        'token': currentUser.accessToken
      }
    };

    // Make a POST request to the API
    axios
      .post('https://mqpjoegrxe.execute-api.us-east-1.amazonaws.com/dev/user/registerUser', data, config)
      .then((response) => {
        console.log('Submission successful:', response.data);
        navigate('/userDashboard');
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };


  return (
    <div className='form'>
      <h2>User Details</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit}> 
        <div>
          <input type="text" id="username" placeholder="Preferred Name" ref={nameRef} required/>
        </div>

        <br></br>
        <h2>Please answer the security questions below</h2>
        <div>
          <label htmlFor="city">What city were you born in?</label>
          <input type="text" id="city" ref={cityRef} required/>
        </div>
        <div>
          <label htmlFor="motherName">What is your mother's maiden name?</label>
          <input type="text" id="motherName" ref={motherNameRef} required/>
        </div>
        <div>
          <label htmlFor="color">What is your favourite color?</label>
          <input type="text" id="color" ref={colorRef} required/>
        </div>
        <div>
          <label htmlFor="fatherBornYear">What year was your father born?</label>
          <input type="text" id="fatherBornYear" ref={fatherBornYearRef} required/>
        </div>
        <button type="submit">Submit</button> 
      </form>
    </div>
  );
};

export default RegisterSuccessRedirect;
