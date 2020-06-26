import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import './AdminIssue.css'

class AdminSick extends Component {
  constructor(props){
    super(props);
    this.state = {
      sickLeaves: []
    };
  }
  componentDidMount(){
    const sickRef = this.props.firebase.database.ref('sickleave/');
    sickRef.on('value', (snapshot) => {
    let sickLeavesnap = snapshot.val();
    let newState = [];
    for (let sickLeave in sickLeavesnap){
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
    this.setState({sickLeaves: newState}); 
    });
  };
  componentWillUnmount() {
    this.props.firebase.database.ref('sickleave/').off();
  }
  render(){
    return(
      <div>
        <h1>Reported sickLeaves</h1>
        {this.state.sickLeaves.map((sickLeave)=>{
          return(
            <div className="uk-container cards">
            <div className="uk-card uk-card-secondary uk-grid">
              <div className="uk-card-body uk-width-1-2">
                <h3 className="uk-card-title">{sickLeave.sickLeaveTitle}</h3>
                <p>Date of sickLeave: {sickLeave.sickLeaveDate}</p>
                <p>sickLeave Description: {sickLeave.sickLeaveReason}</p>
                <p>sickLeave Block: {sickLeave.sickLeaveBlock}</p>
                <p>sickLeave Room: {sickLeave.sickLeaveRoom}</p>
                <p>sickLeave Reported By: {sickLeave.sickLeaveReportedBy}</p>
                <p><Pending stat={sickLeave.sickLeaveStatus} reason = {sickLeave.sickLeaveReasonForRejection} id ={sickLeave.sickLeaveId} fb={this.props.firebase.database}/></p>       
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
const Approved=()=>(
  <p>Sick Leave Status: <span className= "green">Approved</span></p>
);
const Rejected=(props)=>(
  <div>
    <p>Sick Leave Status: <span className= "red">Rejected</span></p>
    <p>Sick Leave Reason for Rejection: {props.reason}</p>
  </div>
);
class Pending extends Component{
  constructor(props){
    super(props);
    this.state ={
      sickLeaveStatus: this.props.stat,
      sickLeaveReasonForRejection: this.props.reason
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickAccept = this.handleClickAccept.bind(this);
    this.handleClickReject = this.handleClickReject.bind(this);
  }
  shouldComponentUpdate() {
    return true;
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleClickAccept(e){
    const itemRef = this.props.fb.ref('sickleave/');
    itemRef.child(this.props.id).update({"sickLeaveStatus": "Approved"});
    this.setState({sickLeaveStatus: "Approved"});
  }
  handleClickReject(e){
    const itemReff = this.props.fb.ref('sickleave/');
    var newUserData = {
      "sickLeaveStatus" : "Rejected",
      "sickLeaveReasonForRejection": this.state.sickLeaveReasonForRejection
    }
    itemReff.child(this.props.id).update(newUserData);
    this.setState({sickLeaveStatus: "Rejected"});
  }
  render(){
    let prin;
    if(this.state.sickLeaveStatus === "Pending")
    {
      prin =<div>
        <p>Sick Leave Status: <span className="yellow">Pending</span></p>
       <div className="uk-card-media-left uk-width-1-2 ">
      <button className="uk-button uk-button-default greenback" onClick={this.handleClickAccept}>Approve</button>
      <button uk-toggle="target: #my-id" type="button" className="uk-button uk-button-default redback">Reject</button>
      <div id="my-id" hidden>
        <textarea className="uk-textarea" name="sickLeaveReasonForRejection" value={this.state.value} onChange = {this.handleChange}></textarea>
        <button className="uk-icon-button" uk-icon="check" style={{backgroundColor: "green", float: "right"}} onClick={this.handleClickReject}></button>
      </div>
      </div>
      </div>;
    }
    else if (this.state.sickLeaveStatus === "Approved"){
      prin = <Approved/>
    }
    else if(this.state.sickLeaveStatus === "Rejected"){
      prin = <Rejected reason={this.state.sickLeaveReasonForRejection}/>
    }
    return(
      <div>{prin}</div>
    );
  }
}
export default withFirebase(AdminSick);