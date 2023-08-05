import CreateTeamDrawer from "../components/Teams/CreateTeam2";
import ManageTeamDrawer from "../components/Teams/ManageTeam2";
import ViewStatistics from "../components/Teams/ViewStatistics2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Team() {
    const[emailId, setEmailId] = useState("");
    const navigate = useNavigate();

    const handleCreateTeamClick = () => {
        navigate('/createteam');
      };
    const handleManageTeamClick = () => {
        navigate('/manageteam');
      };
    const handleViewStatisticsClick = () => {
        navigate('/viewstats');
      };

  return (
    <div>
        <div className="button">
        <button onClick={handleCreateTeamClick}>Create Team</button>
      </div>
      <div className="button">
        <button onClick={handleManageTeamClick}>ManageTeam</button>
      </div>
      <div className="button">
        <button onClick={handleViewStatisticsClick}>View Statistics</button>
      </div>
    <div>
        {/* <ManageTeamDrawer setEmailId={setEmailId}/>
        <ViewStatistics setEmailId={emailId}/> */}
    </div>
    </div>
  );
}

export default Team;