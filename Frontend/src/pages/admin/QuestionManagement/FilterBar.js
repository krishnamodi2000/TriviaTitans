import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const FilterBar = ({ questions, onFilter }) => {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleFilter = () => {
    let filteredData = questions;

    if (category) {
      filteredData = filteredData.filter((question) =>
        question.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (difficulty) {
      filteredData = filteredData.filter(
        (question) => question.difficulty_level.toLowerCase() === difficulty.toLowerCase()
      );
    }

    onFilter(filteredData);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" maxWidth="400px" mx="auto">
      <TextField
        label="Category"
        variant="outlined"
        size="small"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ flex: 1, marginRight: "8px" }}
      />
      <TextField
        label="Difficulty"
        variant="outlined"
        size="small"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        style={{ flex: 1, marginRight: "8px" }}
      />
      <Button variant="contained" onClick={handleFilter} size="large" style={{ backgroundColor: '#4caf50', color: '#ffffff' }}>
        Filter
      </Button>
    </Box>
  );
};

export default FilterBar;
