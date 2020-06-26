import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import {withAuthorization} from './Session';
import './Admin/AdminIssue.css'
//For routing to add sickLeave page
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
  
class UserSick extends Component {
  constructor(props){
    super(props);
    this.state = {
        loading: false,
        sickLeaves: []
    };
    this.handleClick = this.handleClick.bind(this);
  };
  handleClick(e){
      e.preventDefault();
      this.props.history.push(ROUTES.SICK_LEAVE);
  }
  shouldComponentUpdate() {
    return true;
  }
  componentDidMount(){
    this.setState({ loading: true });
    const studyRef = this.props.firebase.database.ref('sickleave/');
    studyRef.on('value', (snapshot) => {
    let sickLeavesnap = snapshot.val();
    let newState = [];
    for (let sickLeave in sickLeavesnap){
        if(sickLeavesnap[sickLeave].sickLeaveReportedBy===this.props.firebase.auth.currentUser.email){
            newState.push({
                sickLeaveBlock: sickLeavesnap[sickLeave].sickLeaveBlock,
                sickLeaveDate: sickLeavesnap[sickLeave].sickLeaveDate,
                sickLeaveId: sickLeavesnap[sickLeave].sickLeaveId,
                sickLeaveReason: sickLeavesnap[sickLeave].sickLeaveReason,
                sickLeaveReasonForRejection: sickLeavesnap[sickLeave].sickLeaveReasonForRejection,
                sickLeaveReportedBy: sickLeavesnap[sickLeave].sickLeaveReportedBy,
                sickLeaveRoom: sickLeavesnap[sickLeave].sickLeaveRoom,
                sickLeaveStatus: sickLeavesnap[sickLeave].sickLeaveStatus, 
                sickLeaveTitle: sickLeavesnap[sickLeave].sickLeaveTitle
            });
        }
        }
    this.setState({ loading: false });
    this.setState({sickLeaves: newState}); 
    });
    
  };
  componentWillUnmount(){
    this.props.firebase.database.ref('sickleave/').off();
  }
  render(){
    return(
      <div className="uk-container">
        <h2>Reported Sick Leaves</h2>
        <button style={{borderRadius: "30px"}} onClick = {this.handleClick}><span className="uk-icon-button" uk-icon="plus-circle"></span>Request Sick Leave</button>
        {this.state.sickLeaves.map((sickLeave)=>{   
            let stat;
            if(sickLeave.sickLeaveStatus === "Pending" || sickLeave.sickLeaveStatus === "pending")
            stat =  <p>Sick Leave Status: <span className="yellow">{sickLeave.sickLeaveStatus}</span></p> ;
            else if(sickLeave.sickLeaveStatus === "Approved" || sickLeave.sickLeaveStatus === "approved")
                stat = <p>Sick Leave Status: <span className="green">{sickLeave.sickLeaveStatus}</span></p> ;
            else 
                stat = <p>Sick Leave Status: <span className="red">{sickLeave.sickLeaveStatus}</span></p>;   
          return(
            <div className="uk-container cards">
            <div className="uk-card uk-card-secondary uk-grid">
              <div className="uk-card-body uk-width-1-2">
                <h3 className="uk-card-title">{sickLeave.sickLeaveTitle}</h3>
                <p>Date of Sick Leave: {sickLeave.sickLeaveDate}</p>
                <p>Sick Leave Reason: {sickLeave.sickLeaveReason}</p>
                <p>Sick Leave Block: {sickLeave.sickLeaveBlock}</p>
                <p>Sick Leave Room: {sickLeave.sickLeaveRoom}</p>
                {stat}
                {sickLeave.sickLeaveStatus === "Rejected" || sickLeave.sickLeaveStatus === "rejected"? <p>Reason For Rejection: {sickLeave.sickLeaveReasonForRejection}</p>:<p></p>}
              </div>              
            </div>
            </div>
          );
        }
          )}
          </div>
    );
  }
}
const condition = authUser => !! authUser;
export default compose(
    withRouter,
    withFirebase,
    withAuthorization(condition)
  )(UserSick);