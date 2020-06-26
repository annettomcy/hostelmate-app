import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import './AdminIssue.css'

class AdminNight extends Component {
  constructor(props){
    super(props);
    this.state = {
      nightStudys: []
    };
  }
  componentDidMount(){
    const nightRef = this.props.firebase.database.ref('nightstudy/');
    nightRef.on('value', (snapshot) => {
    let nightStudysnap = snapshot.val();
    let newState = [];
    for (let nightStudy in nightStudysnap){
      newState.push({
        nightStudyBlock: nightStudysnap[nightStudy].nightStudyBlock,
        nightStudyDate: nightStudysnap[nightStudy].nightStudyDate,
        nightStudyId: nightStudysnap[nightStudy].nightStudyId,
        nightStudyReason: nightStudysnap[nightStudy].nightStudyReason,
        nightStudyReasonForRejection: nightStudysnap[nightStudy].nightStudyReasonForRejection,
        nightStudyReportedBy: nightStudysnap[nightStudy].nightStudyReportedBy,
        nightStudyRoom: nightStudysnap[nightStudy].nightStudyRoom,
        nightStudyStatus: nightStudysnap[nightStudy].nightStudyStatus, 
        nightStudyTitle: nightStudysnap[nightStudy].nightStudyTitle
      });
    }
    this.setState({nightStudys: newState}); 
    });
    
  };
  componentWillUnmount() {
    this.props.firebase.database.ref('nightstudy/').off();
  }
  render(){
    return(
      <div>
        <h1>Reported nightStudys</h1>
        {this.state.nightStudys.map((nightStudy)=>{      
          return(
            <div className="uk-container cards">
            <div className="uk-card uk-card-secondary uk-grid">
              <div className="uk-card-body uk-width-1-2">
                <h3 className="uk-card-title">{nightStudy.nightStudyTitle}</h3>
                <p>Date of nightStudy: {nightStudy.nightStudyDate}</p>
                <p>Night Study Request Description: {nightStudy.nightStudyReason}</p>
                <p>nightStudy Block: {nightStudy.nightStudyBlock}</p>
                <p>nightStudy Room: {nightStudy.nightStudyRoom}</p>
                <p>nightStudy Reported By: {nightStudy.nightStudyReportedBy}</p>
                <p><Pending stat={nightStudy.nightStudyStatus} reason = {nightStudy.nightStudyReasonForRejection} id ={nightStudy.nightStudyId} fb={this.props.firebase.database}/></p>       
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
  <p>Night Study Status: <span className= "green">Approved</span></p>
);
const Rejected=(props)=>(
  <div>
    <p>Night Study Status: <span className= "red">Rejected</span></p>
    <p>Night Study Reason for Rejection: {props.reason}</p>
  </div>
);
class Pending extends Component{
  constructor(props){
    super(props);
    this.state ={
      nightStudyStatus: this.props.stat,
      nightStudyReasonForRejection: this.props.reason
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
    const itemRef = this.props.fb.ref('nightstudy/');
    var newUserData = {
      "nightStudyStatus" : "Approved",
    }
    itemRef.child(this.props.id).update(newUserData);
    this.setState({nightStudyStatus: "Approved"});
  }
  handleClickReject(e){
    const itemReff = this.props.fb.ref('nightstudy/');
    var newUserData = {
      "nightStudyStatus" : "Rejected",
      "nightStudyReasonForRejection": this.state.nightStudyReasonForRejection
    }
    itemReff.child(this.props.id).update(newUserData);
    this.setState({nightStudyStatus: "Rejected"});
  }
  render(){
    let prin;
    if(this.state.nightStudyStatus === "Pending")
    {
      prin =<div>
        <p>Night Study Status: <span className="yellow">Pending</span></p>
       <div className="uk-card-media-left uk-width-1-2 ">
      <button className="uk-button uk-button-default greenback" onClick={this.handleClickAccept}>Approve</button>
      <button uk-toggle="target: #my-id" type="button" className="uk-button uk-button-default redback">Reject</button>
      <div id="my-id" hidden>
        <textarea className="uk-textarea" name="nightStudyReasonForRejection" value={this.state.value} onChange = {this.handleChange}></textarea>
        <button className="uk-icon-button" uk-icon="check" style={{backgroundColor: "green", float: "right"}} onClick={this.handleClickReject}></button>
      </div>
      </div>
      </div>;
    }
    else if (this.state.nightStudyStatus === "Approved"){
      prin = <Approved/>
    }
    else if(this.state.nightStudyStatus === "Rejected"){
      prin = <Rejected reason={this.state.nightStudyReasonForRejection}/>
    }
    return(
      <div>{prin}</div>
    );
  }
}
export default withFirebase(AdminNight);