import React, { useState, useEffect } from 'react';
import { getUserProfileByUserId, updateUserProfile } from '../user-profile-api';
import { useAuth } from '../context/AuthContext';
import { Container, Image, Form, Button } from 'react-bootstrap';
import './UserProfile.css';
import { useNavigate } from "react-router-dom"

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch user profile data from the API when the component mounts
    fetchUserProfileData();
  }, []);

  const fetchUserProfileData = async () => {
    try {
      const userId = currentUser.uid;
      console.log(userId);
      const userProfileData = await getUserProfileByUserId(userId);
      setUserData(userProfileData);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
    }
  };

  const handleCompareAchievement = () => {
    navigate("/compareUser");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      // Perform API call to update the user profile data
      await updateUserProfile(userData);

      // If successful, fetch updated user profile data again
      await fetchUserProfileData();

      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <Container className="user-profile mt-5">
      <div className="text-center">
        <Image src={require('../avatar.png')} alt="User Profile" thumbnail />
        <h2 className="mt-3">Name: {userData.username}</h2>
        <p>User ID: {userData.userid}</p>
        <p>Contact Number: {userData.contactnumber}</p>
        <p>Total Game Points: {userData.totalgamepoint}</p>
        <p>Win/Loss Ratio: {userData.winlossratio}</p>
        <p>Total Games Played: {userData.totalgamesplayed}</p>
      </div>

      {isEditing ? (
        <div className="text-center mt-4">
          {/* Show input fields for editing */}
          <Form>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contact Number:</Form.Label>
              <Form.Control
                type="text"
                value={userData.contactnumber}
                onChange={(e) => setUserData({ ...userData, contactnumber: e.target.value })}
              />
            </Form.Group>
            {/* Add more Form.Group components as needed for other editable properties */}
            <Button variant="primary" onClick={handleSaveClick} style={{marginTop: '10px'}}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleCancelClick} className="ml-2" style={{marginTop: '10px'}}>
              Cancel
            </Button>
          </Form>
        </div>
      ) : (
        <div className="text-center mt-4" style={{marginTop: '10px'}}>
          <Button variant="primary" onClick={handleEditClick}>
            Edit
          </Button>
          <Button variant="primary" style={{marginTop: '10px'}} onClick={handleCompareAchievement}>
            Compare Achievements
          </Button>
        </div>
      )}
    </Container>
  );
};

export default UserProfile;
