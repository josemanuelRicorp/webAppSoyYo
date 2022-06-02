import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginView from './routes/loginView';
import LinksPrimary from './routes/linksPrimary';
import LinksSecondary from './routes/LinksSecondary';
import EditProfileView from './routes/editProfileView';
import SignOutView from './routes/signOutView';
import PublicProfileView from './routes/publicProfileView';
import ChooseUserNameView from './routes/chooseUsernameView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LinksPrimary/>}></Route>
        <Route exact path="login" element={<LoginView />}></Route>
        <Route exact path="/links/1" element={<LinksPrimary />}></Route>
        <Route exact path="/links/2" element={<LinksSecondary/>}></Route>
        <Route exact path="/profile" element={<EditProfileView />}></Route>
        <Route exact path="signout" element={<SignOutView />}></Route>
        <Route exact path="u/:username" element={<PublicProfileView />}></Route>
        <Route exact path="choose-username" element={<ChooseUserNameView />}></Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
