import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext.js";
import axios from "axios";

function CreateTeam() {
  const { currentUser } = useAuth();
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");
  const [email4, setEmail4] = useState("");
  const [teamName, setTeamName] = useState("Alpha");

  const onChangeHandler = (event, emailType) => {
    if (emailType === "email1") {
      setEmail1(event.target.value);
    } else if (emailType === "email2") {
      setEmail2(event.target.value);
    } else if (emailType === "email3") {
      setEmail3(event.target.value);
    } else if (emailType === "email4") {
      setEmail4(event.target.value);
    }
  };

  const getTeamNameHandler = () => {
    // axios.post('https://us-central1-serverless-project-394120.cloudfunctions.net/GenerateTeamName', {'name':"Hello body"}).then((response) => {
    //     console.log(response);

    //     setTeamName(response.data.TeamName);
    //   setNewTeamName(response.data.TeamName);
    // }).catch((error) => {
    //     console.log(error);
    //     });
  };

  const sendInvitesHandler = async () => {
    try {
      const response_invite = await axios.post(
        "https://us-central1-serverless-project-394120.cloudfunctions.net/InviteTeam",
        {
          emails: [currentUser.email, email1, email2],  // email3, email4],
          team_name: teamName,
        }
      );
      const data = response_invite.data;
      console.log(data.body);
      if (data.body === '"Invitations sent successfully"') {
        alert("Invitations sent successfully");
      } else {
        alert("Error sending invitations");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <form>
        <div>
          <label>Team Name</label>
          <input type="text" value={teamName} readOnly />
        </div>
        <div>
          <label>Send Invites to:</label>
          <input
            type="email"
            placeholder="Email Teammate 1"
            value={email1}
            onChange={(event) => onChangeHandler(event, "email1")}
          />
          <input
            type="email"
            placeholder="Email Teammate 2"
            value={email2}
            onChange={(event) => onChangeHandler(event, "email2")}
          />
          <input
            type="email"
            placeholder="Email Teammate 3"
            value={email3}
            onChange={(event) => onChangeHandler(event, "email3")}
          />
          <input
            type="email"
            placeholder="Email Teammate 4"
            value={email4}
            onChange={(event) => onChangeHandler(event, "email4")}
          />
        </div>
        <button type="button" onClick={sendInvitesHandler}>
          Send Invites
        </button>
      </form>
    </>
  );
}

export default CreateTeam;