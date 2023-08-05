import { Container, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Chat(){

    const ENTER_KEY_CODE = 13;

    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');
    const {currentUser} = useAuth();


    useEffect(() => {
        console.log('Opening WebSocket');
        const config = {  headers: {      'content-type': 'application/json'  }};
        axios.post('https://ciyu2dgjpepwbc5vxdidsj6ple0vlgpm.lambda-url.us-east-1.on.aws/', {
        "userId": currentUser.uid
        }, config).then(response => {
            console.log(response)
        setUser(response.data.username);
        })
        webSocket.current = new WebSocket('wss://cwtl8ay572.execute-api.us-east-1.amazonaws.com/production');
        const openWebSocket = () => {
            webSocket.current.onopen = (event) => {
                console.log('Open:', event);
                webSocket.current.send(JSON.stringify({"action": "teamCode", "teamCode": "abc", "player": user}))
            }
            webSocket.current.onclose = (event) => {
                console.log('Close:', event);
            }
        }
        openWebSocket();
        return () => {
            console.log('Closing WebSocket');
            webSocket.current.close();
        }
    }, []);

    useEffect(() => {
        webSocket.current.onmessage = (event) => {
            const chatMessageDto = JSON.parse(event.data);
            console.log('Message:', chatMessageDto);
            setChatMessages([...chatMessages, {
                player: chatMessageDto.from,
                message: chatMessageDto.message
            }]);
            if(scrollBottomRef.current) {
                scrollBottomRef.current.scrollIntoView({ behavior: 'smooth'});
            }
        }
    }, [chatMessages]);



    // const handleUserChange = (event) => {
    //     setUser(event.target.value);
    // }

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const handleEnterKey = (event) => {
        if(event.keyCode === ENTER_KEY_CODE){
            sendMessage();
        }
    }

    const sendMessage = () => {
        if(message) {
            console.log('Send!');
            webSocket.current.send(
                JSON.stringify({action: "sendTeamMsg", "teamCode": "abc", player: user, message: message})
            );
            setMessage('');
        }
    };

    const listChatMessages = chatMessages.map((chatMessageDto, index) => 
        <ListItem key={index}>
            <ListItemText primary={`${chatMessageDto.player}: ${chatMessageDto.message}`}/>
        </ListItem>
    );


    return (
        <Fragment>
            <Container>
                <Paper elevation={5}>
                    <Box p={3}>
                        <Typography variant="h5" gutterBottom>
                            Team Chat
                        </Typography>
                        <Divider />
                        <Grid container spacing={3} alignItems="center">
                            <Grid id="chat-window" xs={12} item>
                                <List id="chat-window-messages">
                                    {listChatMessages}
                                    <ListItem ref={scrollBottomRef}></ListItem>
                                </List>
                            </Grid>
                            {/* <Grid xs={2} item>
                                <FormControl fullWidth>
                                    <TextField onChange={handleUserChange}
                                        value={user}
                                        label="Nickname"
                                        variant="outlined"/>
                                </FormControl>
                            </Grid> */}
                            <Grid xs={9} item>
                                <FormControl fullWidth>
                                    <TextField onChange={handleMessageChange} onKeyDown={handleEnterKey}
                                        value={message}
                                        label="Type your message..."
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                            <Grid xs={1} item>
                                <IconButton onClick={sendMessage}
                                    aria-label="send"
                                    color="primary">
                                        <SendIcon />
                                </IconButton>
                            </Grid>
                            
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </Fragment>
    );
}