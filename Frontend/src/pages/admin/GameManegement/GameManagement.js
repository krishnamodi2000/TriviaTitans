import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const apiUrl = 'https://fwqbr8yyv2.execute-api.us-east-1.amazonaws.com/Admintest';

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    difficulty_level: '',
    time_frame: '',
    game_id: '',
    scheduled_time: '',
  });
  const [selectedGameId, setSelectedGameId] = useState(null);

  useEffect(() => {
    fetchGamesData();
  }, []);

  const fetchGamesData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/getalllgames`);
      console.log(response.data)
      // 
      setGames(response.data); 
      // setGames(data);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  console.log(formData)
  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(`Setting ${name} to ${value}`);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  // const handleCreateGame = async () => {
  //   try {
  //     console.log(games);
  //     await axios.post(`${apiUrl}/creategame`, formData);
  //     fetchGamesData(); // Refresh the game table after creating a new game
  //   } catch (error) {
  //     console.error('Error creating a new game:', error);
  //   }
  // };
  const config = {
    'headers': {
      'content-type': 'application/json'
    }
  };

  // const handleCreateGame = async () => {
  //   try {
  //     await axios.post(`${apiUrl}/creategame`, formData, config);
  //     fetchGamesData(); // Refresh the game table after creating a new game
  //   } catch (error) {
  //     console.error('Error creating a new game:', error);
  //     if (error.response) {
  //       console.error('Response data:', error.response.data);
  //     }
  //   }
  // };
  const handleCreateGame = async () => {
    try {
      // Check if required fields are filled out
      if (!formData.category || !formData.difficulty_level || !formData.time_frame) {
        console.error('Please fill out all required fields');
        return;
      }
  
      await axios.post(`${apiUrl}/creategame`, formData, config);
      fetchGamesData(); // Refresh the game table after creating a new game
    } catch (error) {
      console.error('Error creating a new game:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };
  

  // const handleScheduleGame = async () => {
  //   try {
  //     await axios.post(`${apiUrl}/schedulegames`, formData);
  //     fetchGamesData(); // Refresh the game table after scheduling a game
  //   } catch (error) {
  //     console.error('Error scheduling a game:', error);
  //   }
  // };

  const handleOpenScheduleDialog = (gameId) => {
    setSelectedGameId(gameId);
  };

  const handleCloseScheduleDialog = () => {
    setSelectedGameId(null);
    setFormData({
      ...formData,
      scheduled_time: '',
    });
  };

  const handleScheduleSelectedGame = async () => {
    try {
      // Convert the input to Date and format it as required
      const scheduledTime = new Date(formData.scheduled_time).toISOString();
      await axios.post(`${apiUrl}/schedulegames`, {
        ...formData,
        game_id: selectedGameId, // Set the correct game ID here
        scheduled_time: scheduledTime,
      });
      handleCloseScheduleDialog();
      fetchGamesData(); // Refresh the game table after scheduling the selected game
    } catch (error) {
      console.error('Error scheduling a game:', error);
    }
  };

  return (
    <Container>
      <h1>Game Table</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Difficulty Level</TableCell>
              <TableCell>Time Frame (minutes)</TableCell>
              <TableCell>Schedule</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.game_id}>
                <TableCell>{game.game_id}</TableCell>
                <TableCell>{game.category}</TableCell>
                <TableCell>{game.difficulty_level}</TableCell>
                <TableCell>{game.time_frame_minutes}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenScheduleDialog(game.game_id)} style={{ backgroundColor: '#4caf50', color: '#ffffff' }}>Schedule</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <h2>Create Game</h2>
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <TextField
          label="Difficulty Level"
          name="difficulty_level"
          value={formData.difficulty_level}
          onChange={handleChange}
        />
        <TextField
          label="Time Frame (minutes)"
          name="time_frame"
          value={formData.time_frame}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleCreateGame} style={{ backgroundColor: '#4caf50', color: '#ffffff' }}>
          Create Game
        </Button>
      </div>
      <Dialog open={selectedGameId !== null} onClose={handleCloseScheduleDialog}>
        <DialogTitle>Schedule Game</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the scheduled time for the game with ID: {selectedGameId}
          </DialogContentText>
          <TextField
            label="Scheduled Time"
            type="datetime-local"
            name="scheduled_time"
            value={formData.scheduled_time}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
          <Button onClick={handleScheduleSelectedGame} color="primary">
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GameManagement;
