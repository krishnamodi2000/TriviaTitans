import {
    Button,    
    Drawer, 
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerCloseButton,
    Box,
    Stack,
    Heading,
    DrawerHeader,
    Text,
    useDisclosure,
    VStack} from "@chakra-ui/react";
import { useState } from "react";

function ManageTeamDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const teams = '{"teamNameIds": ["Team1, Team2, Team3, Team4"]}';
    const myObj = JSON.parse(teams);

    const [teamName, setTeamName] = useState(myObj.teamNameIds);


    const getTeamsHandler = () => {
        // axios.post('https://us-central1-serverless-project-394120.cloudfunctions.net/GenerateTeamName', {"emailId": emailId}).then((response) => { 
        //     console.log(response);

        //     setTeamName(response.data.TeamName);
        //   setNewTeamName(response.data.TeamName);
        // }).catch((error) => {
        //     console.log(error);
        //     });
    }

    return (
        <VStack spacing={4} align="center">
        <Button colorScheme="blue" size="lg" onClick={onOpen}>Manage Teams</Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size='md'>
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
                Managing Teams
            </DrawerHeader>
                <DrawerBody>
                    <Stack spacing='24px'>
                    <Box>
                        <Heading size='sm'>Teams you are part of:</Heading>
                        {/* team and part of */}
                        {teamName.map((team) => (
                            <Box>
                            <Text>{team}</Text>
                            <Button> Leave </Button>
                            </Box>
                        ))}
                    </Box>
                    </Stack>
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </VStack>
      );
}

export default ManageTeamDrawer;