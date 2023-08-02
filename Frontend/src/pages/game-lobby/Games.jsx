import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Games() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch the available trivia games from the API
    axios.get('https://sqmgk4hyhzhd44mckgwmymiape0imyqv.lambda-url.us-east-1.on.aws/').then(response => {
      setGames(response.data);
      console.log(response.data)
    });
  }, []);

  

  const filterGame = (game) => {
    return (game.category === searchQuery || game.difficulty === searchQuery || game.time_limit === searchQuery || searchQuery === '')
  }

  const filteredGames = games.filter(filterGame);

  return (
    <div>
      <h1>Available Trivia Games</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search by tag(Ex. football), difficulty(hard|medium|easy) or time frame(Ex. 10min)"
          style={{width: "80%", height: "30px"}}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredGames.map(game => (
        <div key={game.game_id}>
          <h2>{game.name}</h2>
          <p>{game.description}</p>
          <Link to={`/games/${game.game_id}`}>More Details</Link>
          <hr></hr>
        </div>
      ))}
    </div>
  );
}

export default Games;
