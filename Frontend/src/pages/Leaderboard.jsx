import React, { useState, useEffect } from 'react';
import { getLeaderboardByCategory, getLeaderboardByTimeFrame, getAllCategories } from '../leaderboard-api';
import { Container, Row, Col, Form, Table, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('all-time');
  const [selectedEntityType, setSelectedEntityType] = useState('player');
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeaderboardData();
    fetchAllCategories();
  }, [selectedCategory, selectedTimeFrame, selectedEntityType]);

  const fetchLeaderboardData = async () => {
    try {
      let leaderboardData;
      if (selectedCategory) {
        leaderboardData = await getLeaderboardByCategory(selectedCategory, selectedEntityType);
      } else {
        leaderboardData = await getLeaderboardByTimeFrame(selectedTimeFrame, selectedEntityType);
      }
      setLeaderboardData(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  const handleEntityTypeChange = (event) => {
    setSelectedEntityType(event.target.value);
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

  const naviagtePlayersTeams = () => {
    navigate("/topleaderboard");
  };

  const navigateDashboard = () => {
    navigate("/studioleaderboard");
  };

  return (
    <Container className="leaderboard">
      <h2 className="text-center mb-4">Leaderboard</h2>
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="entityTypeSelect">
            <Form.Label>Select Entity Type:</Form.Label>
            <Form.Control as="select" value={selectedEntityType} onChange={handleEntityTypeChange}>
              <option value="player">Players</option>
              <option value="team">Teams</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="categorySelect">
            <Form.Label>Filter by Category:</Form.Label>
            <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="timeFrameSelect">
            <Form.Label>Filter by Time Frame:</Form.Label>
            <Form.Control as="select" value={selectedTimeFrame} onChange={handleTimeFrameChange}>
              <option value="all-time">All Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Table striped bordered hover responsive style={{marginTop: '20px'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Games Played Date</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry) => (
            <tr key={entry.playerid || entry.teamid}>
              <td>{selectedEntityType === 'player' ? entry.player_name : entry.team_name}</td>
              <td>{entry.score}</td>
              <td>{entry.win}</td>
              <td>{entry.loss}</td>
              <td>{entry.gamesplayeddate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-center mt-4">
          <Button variant="primary" style={{marginTop: '10px'}} onClick={naviagtePlayersTeams}>
            Top Players/Teams
          </Button>
          <Button variant="primary" style={{marginTop: '10px'}} onClick={navigateDashboard}>
            Looker Studio Dashboard
          </Button>
      </div>
    </Container>
  );
};

export default Leaderboard;
