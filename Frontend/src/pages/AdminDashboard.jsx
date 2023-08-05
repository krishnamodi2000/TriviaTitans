import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import './main.css';

export default function AdminDashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setError("")
    try {
      await logout()
      navigate("/login")
    } catch {
      setError("Failed to log out")
    }
  }
  console.log(currentUser)

  const handleQuestionManagementClick = () => {
    navigate('/question');
  };

  const handleGameManagementClick = () => {
    navigate('/game');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Admin Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {currentUser.email}
        <div className="button">
          <button onClick={handleQuestionManagementClick}>Question Management</button>
        </div>
        <div className="button">
          <button onClick={handleGameManagementClick}>Game Management</button>
        </div>
        <div className="button">
          <button onClick={handleDashboardClick}>Dashboard</button>
        </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  )
}