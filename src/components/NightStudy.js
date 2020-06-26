import React, { Component} from 'react';
import {withFirebase} from './Firebase';
import {withAuthorization} from './Session';
//For routing back to user night study page
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

class NightStudy extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dd = (today.getDate() < 10 ? '0' : '') + today.getDate(); 
    var MM = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1); 
    var date = dd + '-' + MM + '-' + today.getFullYear() ;
    this.state = {
      nightStudyTitle:'',
      nightStudyBlock:'',
      nightStudyReason: '',
      nightStudyRoom: '',
      nightStudyDate: date,
      nightStudyStatus: 'Pending'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
  }
  
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = this.props.firebase.database.ref('nightstudy/');
    var myEmail = this.props.firebase.auth.currentUser.email;
    const item = {
      nightStudyBlock: this.state.nightStudyBlock,
      nightStudyDate: this.state.nightStudyDate,
      nightStudyId: '',
      nightStudyDescription: this.state.nightStudyReason,
      nightStudyReasonForRejection:'',
      nightStudyReportedBy: myEmail,
      nightStudyRoom: this.state.nightStudyRoom,
      nightStudyStatus: this.state.nightStudyStatus,
      nightStudyTitle: this.state.nightStudyTitle   
    }
    var place = itemsRef.push(item);
    itemsRef.child(place.key).update({'nightStudyId': place.key});
    this.setState({
      nightStudyTitle:'',
      nightStudyBlock:'',
      nightStudyReason: '',
      nightStudyRoom: '',
      nightStudyStatus: 'Pending'
    });
    this.props.history.push(ROUTES.USER_NIGHT);
  }
  render() {
    const isInvalid =
    this.state.nightStudyTitle === '' ||
    this.state.nightStudyBlock === '' ||
    this.state.nightStudyRoom === '' ||
    this.state.nightStudyReason === '';
    return (
      <div>
        <div className="uk-container uk-container-small">
          <h1 className=" uk-align-center uk-text-center">Night Study Request Form</h1>
          <form className="uk-form-horizontal uk-margin-large" onSubmit={this.handleSubmit}>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-text">Title:</label>
              <div className="uk-form-controls">
                <input className="uk-input" id="form-horizontal-text" type="text" name="nightStudyTitle" value={this.state.value} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-select">Block:</label>
              <div className="uk-form-controls">
                <select className="uk-select" id="form-horizontal-select" name='nightStudyBlock' value={this.state.value} onChange={this.handleChange}>
                  <option value="selectb">Select Block</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-select">Room:</label>
              <div className="uk-form-controls">
                <select className="uk-select" id="form-horizontal-select" name='nightStudyRoom' value={this.state.value} onChange={this.handleChange}>
                  <option value="selectr">Select Room</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                </select>
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-text">Description:</label>
              <div className="uk-form-controls">
                <textarea className="uk-textarea" name='nightStudyReason' value={this.state.value} onChange={this.handleChange} />
              </div>
            </div>
            <div className="uk-margin">
              <div className="uk-form-controls">
                <button className="uk-button uk-align-center" disabled={isInvalid} type="submit">Upload Request</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
const condition = authUser => !! authUser;
export default compose(
    withRouter,
    withFirebase,
    withAuthorization(condition)
  )(NightStudy);