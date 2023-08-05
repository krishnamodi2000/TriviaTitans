import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const QuestionsGraph = () => {
  const handleUpdateData = async () => {
    try {
      const url = 'https://fwqbr8yyv2.execute-api.us-east-1.amazonaws.com/Admintest/analysisdashboard';
      const headers = {
        'Content-Type': 'application/json', // Set the Content-Type header to indicate JSON data
        // Add any other headers you need here
      };
      const data = {
        table: 'questionsdb',
        bucket: 'example-bueckt',
        filename: 'questions.csv',
      };

      const response = await axios.post(url, JSON.stringify(data), { headers });

      console.log(response.data); // Log the response data
      // Perform any additional actions after successful update if needed
    } catch (error) {
      console.error('Error updating dashboard:', error);
      // Handle the error case if the API call fails
    }
  };
  return (
    <div>
      <h2>Questions Created Graph</h2>
      <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateData}
        style={{ backgroundColor: '#4caf50', color: '#ffffff' }} // Set custom styles for the button
      >
        Update Data
      </Button>
      {/* Display the data or any other components for the dashboard */}
    </div>
    <iframe width="768px" height="768px" src="https://lookerstudio.google.com/embed/reporting/937fa52f-accd-4c4b-a872-372aa1bc1f0b/page/tN3YD" frameborder="0" allowfullscreen></iframe> 
    </div>
  );
};

export default QuestionsGraph;
