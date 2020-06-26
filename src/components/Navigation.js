import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';

import { AuthUserContext } from './Session';

const Navigation = () =>(
  <div className="uk-position-relative" style={{paddingBottom: "100px"}}>
    <div className="uk-position-top">
      <nav className="uk-navbar-container" uk-navbar>
          <AuthUserContext.Consumer>
          {authUser =>
             authUser ? (
              <NavigationAuth authUser={authUser} />
                ) : (
              <NavigationNonAuth />
               )
          }
          </AuthUserContext.Consumer> 
      </nav>
    </div>
  </div>
);


const NavigationAuth = ({ authUser }) => (
      <ul className="uk-navbar-nav">
         {!authUser.roles[ROLES.ADMIN] && (
        <li>
          <Link to={ROUTES.USER_ISSUE}>Issue Page</Link>
        </li>
         )}
         {!authUser.roles[ROLES.ADMIN] && ( 
        <li>
          <Link to={ROUTES.USER_SICK}>Sick Leave</Link>
        </li>
         )}
        {!authUser.roles[ROLES.ADMIN] && (
        <li>
          <Link to={ROUTES.USER_NIGHT}>Night Study</Link>
        </li>
        )}
        {!authUser.roles[ROLES.ADMIN] && (       
        <li>
          <Link to={ROUTES.NOTICE_BOARD}>Notice Board</Link>
        </li>
         )}
         {!authUser.roles[ROLES.ADMIN] && (
        <li>
          <Link to={ROUTES.FEEDBACK}>Feedback</Link>
        </li>
         )}
    {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ADMIN_ISSUE}>Issues Reported</Link>
      </li>
    )}
    {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ADMIN_SICK}>Sick Leave Requests</Link>
      </li>
    )}
    {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ADMIN_NIGHT}>Night Study Requests</Link>
      </li>
    )}
    {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ANNOUNCEMENTS}>Announcements</Link>
      </li>
    )}
    {!!authUser.roles[ROLES.ADMIN] && (
      <li>
        <Link to={ROUTES.ADMIN_FEEDBACK}>View Feedback</Link>
      </li>
    )}
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav" style={{paddingRight: '20px'}}>
            <li>
              <SignOutButton />
            </li>
          </ul>
        </div>
      </ul>
  );
const NavigationNonAuth=()=>(
    <ul className="uk-navbar-nav">
       <li>
         <Link to={ROUTES.SIGN_IN} style={{fontFamily: 'Dancing Script', fontSize:'large', color: 'black'}}>HostelMate</Link>
       </li>
     </ul>
);
export default Navigation;