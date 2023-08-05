import React from "react";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button } from "@mui/material";


const QuestionTable = ({ questions, onEdit }) => {
  const tableStyle = {
    minWidth: 650,
    borderCollapse: "collapse",
  };

  const tableHeadingStyle = {
    fontWeight: "bold",
    backgroundColor: "white",
    border: "1px solid #fffff",
    padding: "8px",
  };

  const tableCellStyle = {
    borderBottom: "1px solid #ddd",
    padding: "8px",
  };

  const buttonStyle = { backgroundColor: '#4caf50', color: '#ffffff' }; // Custom button style

  const handleDelete = (questionId, difficultyLevel) => {
    // Make API call to delete the question with the given questionId and difficultyLevel
    fetch("https://fwqbr8yyv2.execute-api.us-east-1.amazonaws.com/Admintest/deletequestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_id: questionId,
        difficulty_level: difficultyLevel,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // If the API call is successful, update the state or fetch the updated question list from the server
          console.log("Question deleted successfully");
          // Perform any additional actions after successful deletion if needed
        } else {
          console.error("Failed to delete question");
          // Handle the error case if the API call fails
        }
      })
      .catch((error) => {
        console.error("Error occurred while deleting question:", error);
        // Handle any network or server-related errors
      });
  };

  return (
    <TableContainer component={Paper}>
      <Table style={tableStyle}>
        <TableHead>
          <TableRow>
            <TableCell style={tableHeadingStyle}>Question</TableCell>
            <TableCell style={tableHeadingStyle}>Category</TableCell>
            <TableCell style={tableHeadingStyle}>Difficulty</TableCell>
            <TableCell style={tableHeadingStyle}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.question_id}>
              <TableCell style={tableCellStyle}>{question.question}</TableCell>
              <TableCell style={tableCellStyle}>{question.category}</TableCell>
              <TableCell style={tableCellStyle}>{question.difficulty_level}</TableCell>
              <TableCell style={tableCellStyle}>
                <Button variant="outlined" onClick={() => onEdit(question)} style={buttonStyle}>
                  Edit
                </Button>
              </TableCell>
              <TableCell style={tableCellStyle}>
                <Button
                  variant="outlined"
                  onClick={() => handleDelete(question.question_id, question.difficulty_level)}
                  style={buttonStyle}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuestionTable;
