import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import SignIn from './SignIn';
import IssuePage from './IssuePage';
import NightStudy from './NightStudy';
import Feedback from './Feedback';
import SickLeave from './SickLeave';
//Admin Pages
import AdminIssue from './Admin/AdminIssue';
import AdminSick from './Admin/AdminSick';
import AdminNight from './Admin/AdminNight';
import Announcements from './Admin/Announcements';
import AdminFeedback from './Admin/AdminFeedback';
//User Pages
import NoticeBoard from './NoticeBoard';
import UserIssue from './UserIssue';
import UserNight from './UserNight';
import UserSick from './UserSick';
import * as ROUTES from '../constants/routes';

import { withAuthentication } from './Session';

const App = () => (
  <Router>
      <Navigation />
      <Route exact path={ROUTES.SIGN_IN} component={SignIn} />     
      <Route exact path={ROUTES.ISSUE_PAGE} component={IssuePage} />
      <Route exact path={ROUTES.NIGHT_STUDY} component={NightStudy} />
      <Route exact path={ROUTES.FEEDBACK} component={Feedback} />
      <Route exact path={ROUTES.ANNOUNCEMENTS} component={Announcements} />
      <Route exact path={ROUTES.SICK_LEAVE} component={SickLeave} />
      <Route exact path={ROUTES.ADMIN_ISSUE} component={AdminIssue}/>
      <Route exact path={ROUTES.ADMIN_SICK} component={AdminSick}/>    
      <Route exact path={ROUTES.ADMIN_NIGHT} component={AdminNight}/>
      <Route exact path={ROUTES.ADMIN_FEEDBACK} component={AdminFeedback}/>     
      <Route exact path={ROUTES.USER_ISSUE} component={UserIssue}/> 
      <Route exact path={ROUTES.USER_NIGHT} component={UserNight}/> 
      <Route exact path={ROUTES.USER_SICK} component={UserSick}/>
      <Route exact path={ROUTES.NOTICE_BOARD} component={NoticeBoard}/>
  </Router>
);

export default withAuthentication(App);