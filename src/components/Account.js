import React from 'react';

//import { AuthUserContext, withAuthorization } from '../Session';

/*const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);*/
const AccountPage=()=>(
  <div>
    <h1>Account</h1>
  </div>
);

export default AccountPage;