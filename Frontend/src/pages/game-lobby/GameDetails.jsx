import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState({});

  useEffect(() => {
    // Fetch the game details from the API using the provided ID
    axios.post('https://xclauikju4qegpsbu6wg5ulypq0crxli.lambda-url.us-east-1.on.aws/', {'game_id': id}).then(response => {
      setGame(response.data);
    });
  }, [id]);

  return (
    <div>
      <h1>{game.name}</h1>
      <p>{game.description}</p>
      <p>Difficulty: {game.difficulty}</p>
      <p>Start Time: {game.start_time}</p>
      <p>Category: {game.category}</p>
      <p>Participants: {game.participants_count}</p>
      <p>Quiz Duration: {game.time_limit}</p>
      <Link to={`/game/${game.game_id}`}>Join Game</Link>
    </div>
  );
}

export default GameDetails;