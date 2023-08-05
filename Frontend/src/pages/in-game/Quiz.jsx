import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Chatbox from './Chat';
import './quiz.css';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const QuestionDisplay = () => {
  const {id} = useParams();
  const [question, setQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isLastQuestionDisplayed, setIsLastQuestionDisplayed] = useState(false);
  const [scores, setScores] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [hint, setHint] = useState('');
  const [hintClicked, sethintClicked] = useState(false);
  const [questionNumber, setquestionNumber] = useState(0);


  const socket = useRef(null);
  const {currentUser} = useAuth();
  const [userName, setuserName] = useState();


  useEffect(() => {
    const config = {  headers: {      'content-type': 'application/json'  }};
    axios.post('https://ciyu2dgjpepwbc5vxdidsj6ple0vlgpm.lambda-url.us-east-1.on.aws/', {
      "userId": currentUser.uid
    }, config).then(response => {
      setuserName(response.data.username);
    })
  }, [userName]);

  useEffect(() => {
    socket.current = new WebSocket('wss://nquds1e5se.execute-api.us-east-1.amazonaws.com/production');

    const config = {  headers: {      'content-type': 'application/json'  }};
    axios.post('https://ciyu2dgjpepwbc5vxdidsj6ple0vlgpm.lambda-url.us-east-1.on.aws/', {
      "userId": currentUser.uid
    }, config).then(response => {
      setuserName(response.data.username);
    })

    socket.current.onopen = () => {
      const requestMessage = JSON.stringify({ action: 'joinGame', game_id: id, player: userName , team_id: "abc" });
      socket.current.send(requestMessage);
    };

    socket.current.onmessage = (event) => {
      // Parse the incoming data as a JSON object (assuming the WebSocket sends JSON data)
      const incomingData = JSON.parse(event.data);
      console.log(incomingData)
      if (incomingData.isGameStarted){
        setGameStarted(true);
      }
      
      if (incomingData.scores){
        setScores(incomingData.scores)
      }
      //  if (incomingData.isLastQuestion) {
      //   setIsLastQuestionDisplayed(true);
      //   // setScores(incomingData.scores);
      // } 
      else {
        setHint(incomingData.hint);
        sethintClicked(false);
        setQuestion(incomingData.question);
        setShowAnswer(false);
        setAnswerSubmitted(false);
        setTimeRemaining(15);
        setquestionNumber(incomingData.question_number)
      }

      if (incomingData.isLastQuestion){
        setIsLastQuestionDisplayed(true);
      }
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.current.close();
    };
  }, [id]);

  useEffect(() => {
    const showAnswerTimer = setTimeout(() => {
      setShowAnswer(true);
      socket.current.send(JSON.stringify(
        {"action": "getScores", "question_number": 1}
      ))
      setTimeout(() => {
        
      }, 10000);
    }, 15000); // 15 seconds in milliseconds

    const countdownTimer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000); // 1 second in milliseconds

    return () => {
      clearTimeout(showAnswerTimer);
      clearInterval(countdownTimer);
    };
  }, [question]);

  // const requestNewQuestion = () => {
  //   const requestMessage = JSON.stringify({ action: 'sendQues', game_id: "abc" });
  //   socket.current.send(requestMessage);
  //   console.log("send ques")
  // };

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
  };

  const submitAnswer = () => {
    console.log(selectedAnswer);
    console.log(question.answer);
    if (selectedAnswer === question.answer) {
      socket.current.send(
        JSON.stringify({ action: 'postScores', team_id: "abc" , question_number: questionNumber, score: 1 })
      )
    }
    else{
      socket.current.send(
        JSON.stringify({ action: 'postScores', team_id: "abc", question_number: questionNumber, score: 0 })
      )
    }
    setAnswerSubmitted(true);
  };

  const requestHint = () => {
    sethintClicked(true);
  };

  const chatboxStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
  };

  return (
    <div>
      {!gameStarted ? (
        <p>Waiting for a new question...</p>
      ) : question ? (
        showAnswer ? (
          <div>
            <h2>Correct Answer:</h2>
            <p>{question.answer}</p>

            {
              isLastQuestionDisplayed && (
                <h2> Game has ended. </h2>
            )
            }

            <h2>Current Scores:</h2>
            <ul>
              {scores.map((item, index) => (
                <li key={index}>
                  {Object.keys(item).map((key) => (
                    <span key={key}>
                      {key}: {item[key]}
                    </span>
                  ))}
                </li>
              ))}
            </ul>

          {isLastQuestionDisplayed && (
            <div>
              <Link to='/'>Back to Games Page.</Link>
            </div>
        )}
          </div>
        ) : (
          <div>
            <p>Time Remaining: {timeRemaining} seconds</p>
            <h2>Question:</h2>
            <p>{question.text}</p>
              { hintClicked ?
                (<p>{hint} </p>)
                :(<button onClick={requestHint} disabled={hintClicked}>
                  Request Hint
                </button>)
              }
            <ul>
              {question.choices.map((choice, index) => (
                <li key={index}>
                  <label class="radio-label">
                    <input
                      type="radio"
                      value={choice}
                      checked={selectedAnswer === choice}
                      onChange={() => handleAnswerSelection(choice)}
                      disabled={answerSubmitted}
                    />
                    {choice}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={submitAnswer} disabled={answerSubmitted}>
              Submit Answer
            </button>
          </div>
        )
      ) : (
        <p>Waiting for a new question...</p>
      )}

<div style={chatboxStyle}>
        <Chatbox />
    </div>
    </div>
  );
};

export default QuestionDisplay;
