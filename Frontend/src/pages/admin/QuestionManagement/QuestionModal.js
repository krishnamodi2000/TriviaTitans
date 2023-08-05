import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Box,
} from "@mui/material";


const QuestionModal = ({ modalData, closeModal, handleSaveQuestion }) => {
  const [formData, setFormData] = useState(
    modalData
      ? { ...modalData }
      : {
          question: "",
          category: "",
          difficulty_level: "",
          options: [],
          answer: "",
          explanation: "",
          hints: [],
        }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleOptionChange = (e, index) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const options = [...prevData.options];
      options[index] = value;
      return { ...prevData, options };
    });
  };

  const handleHintChange = (e, index) => {
    const value = e.target.value;
    setFormData((prevData) => {
      const hints = [...prevData.hints];
      hints[index] = value;
      return { ...prevData, hints };
    });
  };

  const handleAddOption = () => {
    setFormData((prevData) => ({
      ...prevData,
      options: [...prevData.options, ""],
    }));
  };

  const handleAddHint = () => {
    setFormData((prevData) => ({
      ...prevData,
      hints: [...prevData.hints, ""],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveQuestion(formData); // Call the handleSaveQuestion function from props
    closeModal();
  };

  const buttonStyle = { backgroundColor: '#4caf50', color: '#ffffff' }; // Custom button style

  return (
    <Dialog open={true} onClose={closeModal} maxWidth="sm" fullWidth>
      <DialogTitle>{modalData ? "Edit Question" : "Create New Question"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Question"
            variant="outlined"
            fullWidth
            margin="normal"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            margin="normal"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <TextField
            label="Difficulty Level"
            variant="outlined"
            fullWidth
            margin="normal"
            name="difficulty_level"
            value={formData.difficulty_level}
            onChange={handleChange}
            required
          />
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              
              { formData.options.map((option, index) => (
                <TextField
                  key={index}
                  variant="outlined"
                  value={option}
                  onChange={(e) => handleOptionChange(e, index)}
                  required
                />
              ))}
              <Button variant="contained" onClick={handleAddOption} color="primary" style={buttonStyle}>
                Add Option
              </Button>
            </FormControl>
          </Box>
          <TextField
            label="Correct Answer"
            variant="outlined"
            fullWidth
            margin="normal"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            required
          />
          <TextField
            label="Explanation"
            variant="outlined"
            fullWidth
            margin="normal"
            name="explanation"
            value={formData.explanation}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
          <Box mt={2}>
            <FormControl fullWidth margin="normal">
              { formData.hints.map((hint, index) => (
                <TextField
                  key={index}
                  variant="outlined"
                  value={hint}
                  onChange={(e) => handleHintChange(e, index)}
                />
              ))}
              <Button variant="contained" onClick={handleAddHint} color="primary" style={buttonStyle}>
                Add Hint
              </Button>
            </FormControl>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit} color="primary" style={buttonStyle}>
          Save
        </Button>
        <Button variant="contained" onClick={closeModal} color="secondary" style={buttonStyle}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionModal;
