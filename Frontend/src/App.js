import React, { Fragment } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import RegisterSuccessRedirect from './pages/RegisterSuccessRedirect';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLandingPage from './pages/AdminLandingPage';
import LoginMFAAuth from './pages/LoginMFAAuth';
import PrivateRoute from './PrivateRoute';
import Games from './pages/game-lobby/Games';
import GameDetails from './pages/game-lobby/GameDetails';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext"
import UserProfile from './pages/UserProfile';
import Homepage from './pages/Homepage';
import AchievementComparison from './pages/AchievementComparison';
import Leaderboard from './pages/Leaderboard';
import TopPerforming from './pages/TopPerforming';
import Team from './pages/Team';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import {
  ChakraProvider,
  Grid,
  theme,
  ColorModeScript
} from '@chakra-ui/react';

function App() {
 
  return (
    <ChakraProvider theme={theme}>
      <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
    <Router>
      <AuthProvider>
          <Fragment>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route exact path='/' element={<PrivateRoute/>}>
                <Route path="/registerSuccessRedirect" element={<RegisterSuccessRedirect/>}/>
                <Route path="/loginMFAAuth" element={<LoginMFAAuth />} />
                <Route path="/userDashboard" element={<UserDashboard />} />
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/adminLandingPage" element={<AdminLandingPage />} />
                <Route exact path="/Homepage" element={<Homepage />} />
                <Route exact path="/Team" element={<Team />} />
                <Route path="/games" element={<Games />} />
                <Route path="/games/:id" element={<GameDetails />} />
                <Route path="/Profile" element={<UserProfile />} />
                <Route path="/compareUser" element={<AchievementComparison />} />
                <Route path="/Leaderboard" element={<Leaderboard />} />
                <Route path="/topleaderboard" element={<TopPerforming />} />
            </Route>
            <Route path="/forgotPassword" element={<ForgotPassword />} />
          </Routes>
          </Fragment>
      </AuthProvider>
    </Router>
    </Grid>
    <ColorModeScript />
    </ChakraProvider>
   
  );
}

export default App;
