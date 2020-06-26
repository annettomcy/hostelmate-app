import React from 'react';
import {withFirebase} from './Firebase';

const SignOutButton = ({firebase})=>(
    <button className="uk-button uk-button-danger" type="button" onClick={firebase.doSignOut} style={{float: "right"}}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);