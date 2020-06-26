import React from 'react';
import auth from "./auth";
import {withFirebase} from './Firebase';

//import { withRouter } from 'react-router-dom';
const SignOutAdmin = ({firebase})=>(
    <button className="uk-button uk-button-danger" type="button" onClick={() => {
        auth.logout(() => {
         console.log(auth.isAuthenticated())
         firebase.doSignOut();
        });
      }} style={{float: "right"}}>
        Sign Out
    </button>
);

export default withFirebase(SignOutAdmin);