import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import { withAuthorization } from './Session';
//For routing back user issue page
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';


class IssuePage extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dd = (today.getDate() < 10 ? '0' : '') + today.getDate(); 
    var MM = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1); 
    var date = dd + '-' + MM + '-' + today.getFullYear() ;

    this.state = {
      issueTitle:'',
      issueBlock:'',
      issueDescription: '',
      issueRoom: '',
      image: null,
      issueImageUrl: '',
      issueDate: date,
      issueStatus: 'Not Fixed'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
    this.handleChanger = this.handleChanger.bind(this);
  }
  handleChanger(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ image }));
    }
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const storage = this.props.firebase.storage;
    const { image } = this.state;
    var date=new Date();
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate(); 
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1); 
    const imgName = 'issue_'+dd+MM+date.getFullYear()+date.getHours()+date.getMinutes()+date.getSeconds();
    const uploadTask = storage.ref(`issueImages/${imgName}`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        storage
          .ref("issueImages")
          .child(imgName)
          .getDownloadURL()
          .then(url => {
            this.setState({issueImageUrl: url});
            const itemsRef = this.props.firebase.database.ref('issues/');
            var myEmail = this.props.firebase.auth.currentUser.email;
            const item = {
              issueBlock: this.state.issueBlock,
              issueDate: this.state.issueDate,
              issueDescription: this.state.issueDescription,
              issueId: '',
              issueImageUrl: this.state.issueImageUrl,
              issueReportedBy: myEmail,
              issueRoom: this.state.issueRoom,
              issueStatus: this.state.issueStatus, 
              issueTitle: this.state.issueTitle
            }
            var place = itemsRef.push(item);
            itemsRef.child(place.key).update({'issueId': place.key});
            this.setState({
              issueTitle:'',
              issueBlock:'',
              issueDescription: '',
              issueRoom: '',
              image: null,
              issueImageUrl: '',
              issueStatus: 'Not Fixed'
            });
            this.props.history.push(ROUTES.USER_ISSUE);
          });
      }
    );

    //initially everything was placed here, but the imageurl was getting updated before upload to storage hence this way
    
  }
  render() {
    const isInvalid =
      this.state.issueTitle === '' ||
      this.state.issueBlock === '' ||
      this.state.issueRoom === '' ||
      this.state.issueDescription === '';
    return (
      <div>
        <div className="uk-container uk-container-small">
          <h1 className="uk-align-center uk-text-center">Issue Reporting Form</h1>
          <form className="uk-form-horizontal uk-margin-large" onSubmit={this.handleSubmit} >
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-text">Issue Title:</label>
              <div className="uk-form-controls">
                <input className="uk-input" id="form-horizontal-text" type="text" name="issueTitle" value={this.state.value} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-select">Block:</label>
              <div className="uk-form-controls">
                <select className="uk-select" id="form-horizontal-select" name='issueBlock' value={this.state.value} onChange={this.handleChange}>
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
                <select className="uk-select" id="form-horizontal-select" name='issueRoom' value={this.state.value} onChange={this.handleChange}>
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
              <label className="uk-form-label" for="form-horizontal-text">Issue Description:</label>
              <div className="uk-form-controls">
                <textarea className="uk-textarea" name='issueDescription' value={this.state.value} onChange={this.handleChange} />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-text">Upload Image of Issue:</label>
              <div className="uk-form-controls">
              <input type="file" onChange={this.handleChanger}/>
              </div>
            </div>
            <div className="uk-margin">
              <div className="uk-form-controls">
                <button className="uk-button uk-align-center" disabled={isInvalid} type="submit">Report Issue</button>
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
  )(IssuePage);