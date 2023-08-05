import React, { Fragment } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import RegisterSuccessRedirect from './pages/RegisterSuccessRedirect';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLandingPage from './pages/AdminLandingPage';
import AchievementComparison from './pages/AchievementComparison';
import UserProfile from './pages/UserProfile';
import TopPerforming from './pages/TopPerforming';
import Leaderboard from './pages/Leaderboard';
import LoginMFAAuth from './pages/LoginMFAAuth';
import Team from './pages/teamupdate';
import PrivateRoute from './PrivateRoute';
import Games from './pages/game-lobby/Games';
import GameDetails from './pages/game-lobby/GameDetails';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext"
import GameManagement from './pages/admin/GameManegement/GameManagement';
import AnalysisDashbaord from './pages/admin/AnalysisDashboard/AnalysisDashboard';
import Question from './pages/admin/QuestionManagement/Question';
import CreateTeam from './components/Teams/CreateTeam2';
import QuestionDisplay from './pages/in-game/Quiz';
 
function App() {
 
  return (
    <Router>
      <AuthProvider>
      <div>
        <section>
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
                <Route path="/team" element={<Team/>} />
                <Route path="/createteam" element={<CreateTeam/>} />
                {/* <Route path="/manageteam" element={<ManageTeam/>} /> */}
                {/* <Route path="/viewstats" element={<ViewStatistics/>} /> */}
                <Route path="/games" element={<Games />} />
                <Route path="/games/:id" element={<GameDetails />} />
                <Route path="/quiz/:id" element={<QuestionDisplay />} />
                {/* <Route path="/userProfile" element={<UserProfile />} />
                <Route path="/compareUser" element={<AchievementComparison />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/topleaderboard" element={<TopPerforming />} /> */}
            </Route>
            <Route path="/forgotPassword" element={<ForgotPassword />} />
          </Routes>
          </Fragment>
        </section>
      </div>
      </AuthProvider>
    </Router>
   
  );
}

export default App;
