import { Button, VStack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom'


function Homepage() {
  const navigate = useNavigate();
  const handleClick = (path) => {
    navigate(path);
  };

  return (

    <VStack spacing={4} align="center">
      <Button colorScheme="blue" size="lg" onClick={() => handleClick('/Team')}>Team</Button>
      <Button colorScheme="blue" size="lg" onClick={() => handleClick('/Game')}>Game</Button>
      <Button colorScheme="blue" size="lg" onClick={() => handleClick('/Profile')}>Profile</Button>
      <Button colorScheme="blue" size="lg" onClick={() => handleClick('/Leaderboard')}>Leaderboard</Button>
    </VStack>
  );
}

export default Homepage;