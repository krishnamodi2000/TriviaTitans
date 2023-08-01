import axios from 'axios';

const API_BASE_URL = 'https://il29bzij7j.execute-api.us-east-1.amazonaws.com/prod';

// API endpoint to update team score
export const updateTeamScore = async (teamData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/updateteamscore`, teamData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating team score: ' + error.message);
    }
};

// API endpoint to update player score
export const updatePlayerScore = async (playerData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/updateplayerscore`, playerData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating player score: ' + error.message);
    }
};

// API endpoint to get leaderboard by category
export const getLeaderboardByCategory = async (category) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/getleaderboardbycategory`, {
            category,
            type: 'player',
        });
        return response.data;
    } catch (error) {
        throw new Error('Error getting leaderboard by category: ' + error.message);
    }
};

// API endpoint to get leaderboard by time frame
export const getLeaderboardByTimeFrame = async (timeFrame) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/getleaderboardbytimeframe`, {
            timeFrame,
            type: 'player',
        });
        return response.data;
    } catch (error) {
        throw new Error('Error getting leaderboard by time frame: ' + error.message);
    }
};

// API endpoint to get top performing players
export const getTopPerformingPlayers = async (numberOfTopPlayers) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/gettopperformingplayers`, {
            numberOfTopPlayers,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error getting top performing players: ' + error.message);
    }
};

// API endpoint to get top performing teams
export const getTopPerformingTeams = async (numberOfTopTeams) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/gettopperformingteams`, {
            numberOfTopTeams,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error getting top performing teams: ' + error.message);
    }
};

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getallcategory`);
        return response.data;
    } catch (error) {
        throw new Error('Error getting all categories: ' + error.message);
    }
};