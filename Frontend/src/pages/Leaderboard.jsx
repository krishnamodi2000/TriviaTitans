import React, { useState, useEffect } from 'react';
import {
  getLeaderboardByCategory,
  getLeaderboardByTimeFrame,
  getAllCategories,
} from '../leaderboard-api';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('all-time');

  useEffect(() => {
    fetchLeaderboardData();
    fetchAllCategories();
  }, [selectedCategory, selectedTimeFrame]);

  const fetchLeaderboardData = async () => {
    try {
      let leaderboardData;
      if (selectedCategory) {
        leaderboardData = await getLeaderboardByCategory(selectedCategory);
      } else {
        leaderboardData = await getLeaderboardByTimeFrame(selectedTimeFrame);
      }
      setLeaderboardData(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Error fetching all categories:', error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleTimeFrameChange = (event) => {
    setSelectedTimeFrame(event.target.value);
  };

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <div>
        <label>
          Filter by Category:
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Filter by Time Frame:
          <select value={selectedTimeFrame} onChange={handleTimeFrameChange}>
            <option value="all-time">All Time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Player ID</th>
            <th>Score</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Games Played Date</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry) => (
            <tr key={entry.playerid}>
              <td>{entry.playerid}</td>
              <td>{entry.score}</td>
              <td>{entry.win}</td>
              <td>{entry.loss}</td>
              <td>{entry.gamesplayeddate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
