import {
    Button,    
    Drawer, 
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerCloseButton,
    Box,
    Stack,
    FormLabel,
    Textarea,
    DrawerFooter,
    Input,
    InputGroup,
    DrawerHeader,
    useDisclosure,
    VStack} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";


function CreateTeamDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure()
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
    }

    const getTeamNameHandler = () => {
        // axios.post('https://us-central1-serverless-project-394120.cloudfunctions.net/GenerateTeamName', {'name':"Hello body"}).then((response) => { 
        //     console.log(response);

        //     setTeamName(response.data.TeamName);
        //   setNewTeamName(response.data.TeamName);
        // }).catch((error) => {
        //     console.log(error);
        //     });
    }

    const sendInvitesHandler = () => {
        axios.post('http://localhost:5000/api/teams/create', {
            email: [email1, email2, email3, email4]
        }).then((response) => {
            console.log(response);
            setTeamName(response.data.TeamName);
        }).catch((error) => {
            console.log(error);
        }
        );
    }

    useEffect(() => {

        if(isOpen){
            getTeamNameHandler()
            console.log("Executing this method");
        }
        
      }, [isOpen]);

    return (
        <VStack spacing={4} align="center">
        <Button colorScheme="blue" size="lg" onClick={onOpen}>Create Team</Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size='md'>
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
                Creating a Team
            </DrawerHeader>
                <DrawerBody>
                    <Stack spacing='24px'>
                    <Box>
                        <FormLabel htmlFor='username'>Team Name</FormLabel>
                        {/* Show the AI Generated Team from the Response */}
                        {teamName}
                    </Box>
                    <Stack spacing='10px'>
                        <FormLabel htmlFor='email'>Send Invites to:</FormLabel>
                        <InputGroup>
                        <Input
                            type='email'
                            id='email1'
                            placeholder='Email Teammate 1'
                            size='md'
                            value={email1}
                            onChange={(event) => onChangeHandler(event, "email1")}
                        />
                        </InputGroup>
                        <InputGroup>
                        <Input
                            type='email'
                            id='email2'
                            placeholder='Email Teammate 2'
                            size='md'
                            value={email2}
                            onChange={(event) => onChangeHandler(event, "email2")}
                        />
                        </InputGroup>
                        <InputGroup>
                        <Input
                            type='email'
                            id='email3'
                            placeholder='Email Teammate 3'
                            size='md'
                            value={email3}
                            onChange={(event) => onChangeHandler(event, "email3")}
                        />
                        </InputGroup>
                        <InputGroup>
                        <Input
                            type='email'
                            id='email4'
                            placeholder='Email Teammate 4'
                            size='md'
                            value={email4}
                            onChange={(event) => onChangeHandler(event, "email4")}
                        />
                        </InputGroup>
                    </Stack>
                        
                        <Box>
                            <FormLabel htmlFor='desc'>Description</FormLabel>
                            <Textarea id='desc' />
                        </Box>
                    </Stack>
                </DrawerBody>

                <DrawerFooter borderTopWidth='1px'>
                    <Button variant='outline' mr={3} onClick={onClose}>
                    Cancel
                    </Button>
                    <Button colorScheme='green' onClick={sendInvitesHandler}>Send Invites</Button>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </VStack>
      );
}

export default CreateTeamDrawer;