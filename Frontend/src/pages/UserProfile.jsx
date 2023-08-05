import React, { useState, useEffect } from 'react';
import { getUserProfileByUserId, updateUserProfile } from '../user-profile-api';
import { useAuth } from '../context/AuthContext';
import './main.css';

const UserProfile = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const { currentUser} = useAuth();

    useEffect(() => {
        // Fetch user profile data from the API when the component mounts
        fetchUserProfileData();
    }, []);

    const fetchUserProfileData = async () => {
        try {
            const userId = currentUser.uid; 
            const userProfileData = await getUserProfileByUserId(userId);
            setUserData(userProfileData);
        } catch (error) {
            console.error('Error fetching user profile data:', error);
        }
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
        <div className="user-profile">
            <h2>{userData.username}</h2>
            <p>Email: {userData.email}</p>
            <p>User ID: {userData.userid}</p>
            <p>Contact Number: {userData.contactnumber}</p>
            {/* <p>Total Game Points: {userData.totalgamepoint}</p>
            <p>Win/Loss Ratio: {userData.winlossratio}</p>
            <p>Total Games Played: {userData.totalgamesplayed}</p> */}

            {isEditing ? (
                <div className='form'>
                    {/* Show input fields for editing */}
                    <label>
                        Username:
                        <input
                            type="text"
                            value={userData.username}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        />
                    </label>
                    <label>
                        Contact Number:
                        <input
                            type="text"
                            value={userData.contactnumber}
                            onChange={(e) => setUserData({ ...userData, contactnumber: e.target.value })}
                        />
                    </label>
                    {/* Add more input fields as needed for other editable properties */}
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            ) : (
                <div>
                    <button onClick={handleEditClick}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
