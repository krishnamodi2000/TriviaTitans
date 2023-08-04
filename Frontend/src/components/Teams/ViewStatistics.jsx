import {
    Button,    
    Drawer, 
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerCloseButton,
    Box,
    Stack,
    CardHeader,
    CardBody,
    Heading,
    Card,
    Text,
    DrawerHeader,
    useDisclosure,
    VStack} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

function ViewStatistics({emailId}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [teamStats, setTeamStats] = useState("Omega");

    const getTeamStatisticsHandler = () => {
        // axios.post('https://us-central1-serverless-project-394120.cloudfunctions.net/GenerateTeamName', {emailId}).then((response) => { 
        //     console.log(response);

        //     setTeamStats(response.data.TeamName);
        // }).catch((error) => {
        //     console.log(error);
        //     });
    }

    return (
        <VStack spacing={4} align="center">
        <Button colorScheme="blue" size="lg" onClick={onOpen}>Team Statistics</Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size='md'>
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
                Team Overview
            </DrawerHeader>
                <DrawerBody spacing='10px'>
                    {/* <Stack spacing='24px'>
                    <Box>

                    </Box>
                    </Stack> */}
                    <Card>
                    <CardHeader>
                        <Heading size='md'>Team Statistics</Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                            Summary
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                            {/* Fetch and view all the statistics of your team. */}
                            {teamStats}
                            </Text>
                        </Box>
                        </Stack>
                    </CardBody>
                    </Card>
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </VStack>
      );
}

export default ViewStatistics;