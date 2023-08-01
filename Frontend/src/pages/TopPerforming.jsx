import React, { useState, useEffect } from 'react';
import { getTopPerformingPlayers, getTopPerformingTeams } from '../leaderboard-api';

const TopPerforming = () => {
  const [topPerformingData, setTopPerformingData] = useState([]);
  const [selectedType, setSelectedType] = useState('player');

  useEffect(() => {
    fetchTopPerformingData();
  }, [selectedType]);

  const fetchTopPerformingData = async () => {
    try {
      let topPerformingData;
      if (selectedType === 'player') {
        topPerformingData = await getTopPerformingPlayers(10);
      } else {
        topPerformingData = await getTopPerformingTeams(10);
      }
      setTopPerformingData(topPerformingData);
    } catch (error) {
      console.error('Error fetching top performing data:', error);
    }
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="top-performing">
      <h2>Top Performing {selectedType === 'player' ? 'Players' : 'Teams'}</h2>
      <div>
        <label>
          Select Type:
          <select value={selectedType} onChange={handleTypeChange}>
            <option value="player">Players</option>
            <option value="team">Teams</option>
          </select>
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Score</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {topPerformingData.map((entry) => (
            <tr key={selectedType === 'player' ? entry.playerid : entry.teamid}>
              <td>{selectedType === 'player' ? entry.playerid : entry.teamid}</td>
              <td>{entry.score}</td>
              <td>{entry.win}</td>
              <td>{entry.loss}</td>
              <td>{entry.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopPerforming;
