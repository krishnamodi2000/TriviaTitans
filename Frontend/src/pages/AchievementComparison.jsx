import React, { useState, useEffect } from 'react';
import { getAllUsers, compareAchievement } from '../user-profile-api';
import { Form, Button, Table } from 'react-bootstrap';

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

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.userid === userId);
    return user ? user.username : '';
  };

  return (
    <div className="achievement-comparison">
      <h2>Achievement Comparison</h2>
      <Form>
        <Form.Group>
          <Form.Label>Select User 1:</Form.Label>
          <Form.Control as="select" value={selectedUser1} onChange={handleUser1Change}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.userid} value={user.userid}>
                {user.username}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Select User 2:</Form.Label>
          <Form.Control as="select" value={selectedUser2} onChange={handleUser2Change}>
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.userid} value={user.userid}>
                {user.username}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={handleCompareClick}>
          Compare Achievements
        </Button>
      </Form>

      {comparisonResult && (
        <div className="mt-4">
          <h3>Comparison Result</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Score</th>
                <th>Rank</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{getUserNameById(comparisonResult.userid1)}</td>
                <td className={comparisonResult.rank1 < comparisonResult.rank2 ? 'highlight' : ''}>
                  {comparisonResult.score1}
                </td>
                <td>{comparisonResult.rank1}</td>
              </tr>
              <tr>
                <td>{getUserNameById(comparisonResult.userid2)}</td>
                <td className={comparisonResult.rank2 < comparisonResult.rank1 ? 'highlight' : ''}>
                  {comparisonResult.score2}
                </td>
                <td>{comparisonResult.rank2}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AchievementComparison;
