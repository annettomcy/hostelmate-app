import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';

class SignInPage extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      error: null,
      user:'',
      pass:''
    }; 
    this.handleSubmitt = this.handleSubmitt.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmitt(e) {
    e.preventDefault();
    let email, password;
    email = this.state.user+'@domain.com';
    password = this.state.user+this.state.pass;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ error: null,
          user:'',
          pass:'' });
        this.props.history.push(ROUTES.ADMIN_ISSUE);
      })
      .catch(error => {
        this.setState({ error });
      });
    
  }
  handleSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
          this.setState({ error: null });
          this.props.history.push(ROUTES.USER_ISSUE);
        })
        .catch(error => {
            this.setState({ error });
          });

    event.preventDefault();
    };
  
  render() {
    const isInvalid =
      this.state.user === '' ||
      this.state.pass === '';
    return (
      <div className="uk-container uk-align-center">
      <h2 className="uk-text-center">Sign In</h2>
      <form className="uk-container-small uk-align-center" onSubmit={this.handleSubmitt}>
        <div className="uk-margin ">
            <input className="uk-input uk-form-width-medium uk-align-center" type="text" name="user" placeholder="Username" value={this.state.value} onChange={this.handleChange}/>
        </div>
        <div className="uk-margin">
            <input className="uk-input uk-form-width-medium uk-align-center" type="password" name="pass" placeholder="Password" value={this.state.value} onChange={this.handleChange}/>
        </div>
        <div className="uk-margin">
              <div className="uk-form-controls">
                <button className="uk-button uk-align-center" disabled={isInvalid} type="submit">Sign In</button>
              </div>
            </div>
      </form>
      <form className="uk-container-small uk-align-center" onSubmit={this.handleSubmit}>
        <p className="uk-text-lead uk-text-center">or</p>
        <button className="uk-button uk-align-center" type="submit">Sign In with Google<span uk-icon="google"></span></button>
      </form>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withFirebase,
)(SignInPage);
