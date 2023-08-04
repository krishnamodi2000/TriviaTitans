import { 
    VStack, 
    Grid 
 } from "@chakra-ui/react";
import CreateTeamDrawer from "../components/Teams/CreateTeam";
import ManageTeamDrawer from "../components/Teams/ManageTeam";
import ViewStatistics from "../components/Teams/ViewStatistics";
import { useState } from "react";

function Team() {
    const[emailId, setEmailId] = useState("");

  return (
    <Grid minH="100vh" p={3}>
    <VStack spacing={4} align="center">
        <CreateTeamDrawer />
        <ManageTeamDrawer setEmailId={setEmailId}/>
        <ViewStatistics setEmailId={emailId}/>
    </VStack>
    </Grid>
  );
}

export default Team;