import axios from 'axios';

const API_BASE_URL = 'https://us-central1-future-pulsar-387719.cloudfunctions.net';

export const addUserProfile = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addUserProfile`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Error adding user profile: ' + error.message);
  }
};

const config = {
  headers: {  
    'content-type': 'application/json'
  }
};

export const getUserProfileByUserId = async (userId) => {
  try {
    const response = await axios.post('https://ciyu2dgjpepwbc5vxdidsj6ple0vlgpm.lambda-url.us-east-1.on.aws/', { userId: userId }, config);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllUsers`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching all users: ' + error.message);
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/updateUserProfile`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating user profile: ' + error.message);
  }
};

export const updateUserStatistics = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/updateUserStatistics`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating user statistics: ' + error.message);
  }
};

export const compareAchievement = async (userId1, userId2) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/compareAchievement`, {
      userid1: userId1,
      userid2: userId2,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error comparing achievements: ' + error.message);
  }
};
