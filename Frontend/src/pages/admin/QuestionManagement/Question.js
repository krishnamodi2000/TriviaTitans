import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionTable from "./QuestionTable";
import FilterBar from "./FilterBar";
import QuestionModal from "./QuestionModal";
import { Button } from "@mui/material";

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://fwqbr8yyv2.execute-api.us-east-1.amazonaws.com/Admintest/getquestions"
      );
      const parsedData = response.data;
      setQuestions(parsedData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleFilter = (filteredData) => {
    setFilteredQuestions(filteredData);
  };

  const handleEdit = (question) => {
    setModalData(question);
    setShowModal(true);
  };

  const handleCreate = () => {
    setModalData(null);
    setShowModal(true);
  };

  const handleSaveQuestion = async (formData) => {
    try {
      if (modalData) {
        // Update existing question
        await axios.post(
          "https://fwqbr8yyv2.execute-api.us-east-1.amazonaws.com/Admintest/updatequestions",
          formData
        );
      } else {
        // Create new question
        await axios.post(
          "https://fwqbr8yyv2.execute-api.us-east-1.amazonaws.com/Admintest/createquestions",
          formData
        );
      }
      closeModal();
      fetchQuestions(); // Refresh questions after saving or updating
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div>
      <FilterBar questions={questions} onFilter={handleFilter} />
      <Button variant="contained" color="primary" onClick={handleCreate} style={{ backgroundColor: '#4caf50', color: '#ffffff' }}>
        Create New Question
      </Button>
      {showModal && (
        <QuestionModal
          modalData={modalData}
          closeModal={closeModal}
          handleSaveQuestion={handleSaveQuestion}
        />
      )}
      <QuestionTable
        questions={filteredQuestions.length > 0 ? filteredQuestions : questions}
        onEdit={handleEdit}
      />
      
    </div>
  );
};

export default Question;
