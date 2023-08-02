import React, { useState, useEffect } from 'react';
import { getAllUsers, compareAchievement } from '../user-profile-api';

const AchievementComparison = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser1, setSelectedUser1] = useState('');
  const [selectedUser2, setSelectedUser2] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);

  useEffect(() => {
    // Fetch all users when the component mounts
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const handleUser1Change = (event) => {
    setSelectedUser1(event.target.value);
  };

  const handleUser2Change = (event) => {
    setSelectedUser2(event.target.value);
  };

  const handleCompareClick = async () => {
    try {
      if (selectedUser1 && selectedUser2) {
        const result = await compareAchievement(selectedUser1, selectedUser2);
        setComparisonResult(result);
      }
    } catch (error) {
      console.error('Error comparing achievements:', error);
    }
  };

  return (
    <div className="achievement-comparison">
      <h2>Achievement Comparison</h2>
      <div>
        <label>
          Select User 1:
          <select value={selectedUser1} onChange={handleUser1Change}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.userid} value={user.userid}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Select User 2:
          <select value={selectedUser2} onChange={handleUser2Change}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.userid} value={user.userid}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={handleCompareClick}>Compare Achievements</button>

      {comparisonResult && (
        <div>
          <h3>Comparison Result:</h3>
          <p>User 1 (ID: {comparisonResult.userid1})</p>
          <p>Score: {comparisonResult.score1}</p>
          <p>Rank: {comparisonResult.rank1}</p>
          <hr />
          <p>User 2 (ID: {comparisonResult.userid2})</p>
          <p>Score: {comparisonResult.score2}</p>
          <p>Rank: {comparisonResult.rank2}</p>
        </div>
      )}
    </div>
  );
};

export default AchievementComparison;
