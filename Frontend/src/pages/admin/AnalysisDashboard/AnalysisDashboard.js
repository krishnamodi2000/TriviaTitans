import React from 'react';
import Dashboard from './Dashboard';
import GameCreatedGraph from './GameCreatedGraph';
import QuestionsGraph from './QuestionsGraph';

const AnalysisDashbaord = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <GameCreatedGraph />
      <QuestionsGraph />
    </div>
  );
};

export default AnalysisDashbaord;
