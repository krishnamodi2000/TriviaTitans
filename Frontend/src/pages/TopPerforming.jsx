import React, { useState, useEffect } from 'react';
import { getTopPerformingPlayers, getTopPerformingTeams } from '../leaderboard-api';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';

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
    <Container className="top-performing">
      <h2 className="text-center mb-4">Top Performing {selectedType === 'player' ? 'Players' : 'Teams'}</h2>
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4}>
          <Form.Group controlId="typeSelect">
            <Form.Label>Select Type:</Form.Label>
            <Form.Control as="select" value={selectedType} onChange={handleTypeChange}>
              <option value="player">Players</option>
              <option value="team">Teams</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Table striped bordered hover responsive style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {topPerformingData.map((entry) => (
            <tr key={selectedType === 'player' ? entry.playerid : entry.teamid}>
              <td>{selectedType === 'player' ? entry.player_name : entry.team_name}</td>
              <td>{entry.score}</td>
              <td>{entry.win}</td>
              <td>{entry.loss}</td>
              <td>{entry.rank}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      
    </Container>
  );
};

export default TopPerforming;
