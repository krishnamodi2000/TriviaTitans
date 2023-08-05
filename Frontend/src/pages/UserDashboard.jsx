import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom"

export default function UserDashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogoutClick() {
    setError("")
    try {
      await logout()
      navigate("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  const handleLeaderBoardClick = () => {
    navigate('/leaderboard');
  };

  const handleGameClick = () => {
    navigate('/games');
  };

  const handleProfileClick = () => {
    navigate('/userProfile');
  };

  // const handleTeamClick = () => {
  //   navigate('/team');
  // };

  return (
    <div className="form">
      <h2>User Landing Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <strong>Email:</strong> {currentUser.email}
      {/* <div className="button">
        <button onClick={handleTeamClick}>Team</button>
      </div> */}
      <div className="button">
        <button onClick={handleLeaderBoardClick}>LeaderBoard</button>
      </div>
      <div className="button">
        <button onClick={handleGameClick}>Game</button>
      </div>
      <div className="button">
        <button onClick={handleProfileClick}>Profile</button>
      </div>
      <iframe
        src="https://d237pstd9kt2he.cloudfront.net"
        title="Chatbot"
        width="100%"
        height="500px"
      />
      <div className="button">
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </div>
  );
};
