import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './main.css';

const AdminLandingPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");

  const handleUserDashboardClick = () => {
    navigate('/userDashboard');
  };

  const handleAdminDashboardClick = () => {
    navigate('/adminDashboard');
  };

  async function handleLogoutClick() {
    setError("")
    try {
      await logout()
      navigate("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <div className="form">
      <h2>Admin Landing Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <strong>Email:</strong> {currentUser.email}
      <div className="button">
        <button onClick={handleUserDashboardClick}>User Dashboard</button>
      </div>
      <div className="button">
        <button onClick={handleAdminDashboardClick}>Admin Dashboard</button>
      </div>
      <div className="button">
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </div>
  );
};

export default AdminLandingPage;
