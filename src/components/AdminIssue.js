import React, { Component } from 'react';
import {withFirebase} from './Firebase';

import './AdminIssue.css'

class AdminIssue extends Component {
  constructor(props){
    super(props);
    this.state = {
      issues: []
      };
  };
  shouldComponentUpdate() {
    return true;
  }
  componentDidMount(){
    const issueRef = this.props.firebase.database.ref('issues/');
    issueRef.on('value', (snapshot) => {
    let issuesnap = snapshot.val();
    let newState = [];
    for (let issue in issuesnap){
      newState.push({
        issueBlock: issuesnap[issue].issueBlock,
        issueDate: issuesnap[issue].issueDate,
        issueDescription: issuesnap[issue].issueDescription,
        issueId: issuesnap[issue].issueId,
        issueImageUrl: issuesnap[issue].issueImageUrl,
        issueReportedBy: issuesnap[issue].issueReportedBy,
        issueRoom: issuesnap[issue].issueRoom,
        issueStatus: issuesnap[issue].issueStatus, 
        issueTitle: issuesnap[issue].issueTitle
      });
    }
    this.setState({issues: newState}); 
    });
  };
  componentWillUnmount() {
    this.props.firebase.database.ref('issues/').off();
  }
  render(){
    return(
      <div>
        <h1>Reported Issues</h1>
        {this.state.issues.map((issue)=>{
          return(
            <div className="uk-container cards">
            <div className="uk-card uk-card-secondary uk-grid">
              <div className="uk-card-media-left uk-width-1-2 ">
                <img className="uk-align-center" src={issue.issueImageUrl} alt=""/>
              </div>
              <div className="uk-card-body uk-width-1-2">
                  <h3 className="uk-card-title">{issue.issueTitle}</h3>
                  <p>Date of issue: {issue.issueDate}</p>
                  <p>Issue Description: {issue.issueDescription}</p>
                  <p>Issue Block: {issue.issueBlock}</p>
                  <p>Issue Room: {issue.issueRoom}</p>
                  <p>Issue Reported By: {issue.issueReportedBy}</p>
                  <p>{issue.issueStatus === "Fixed"? <IssueFixed/>:<IssueNotFixed id={issue.issueId} fb={this.props.firebase.database}/>}</p>
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
const IssueFixed=()=>(
  <p>Issue Status: <span className= "green">Fixed</span></p>
);
class IssueNotFixed extends Component{
  constructor(props){
    super(props);
    this.state = {reset: "Not Fixed"};
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(e){
    const itemRef = this.props.fb.ref('issues/');
    itemRef.child(this.props.id).update({'issueStatus': "Fixed"});
    this.setState({reset: "Fixed"});
   }
   render(){
     let print;
     if(this.state.reset==="Not Fixed"){
      print = <p>Issue Status: <span className= "red">{this.state.reset}</span>
      <button className="uk-icon-button" uk-icon="check" style={{backgroundColor: "green", float: "right"}} onClick={this.handleClick}></button>
    </p>;
     }
     else{
      print = <p>Issue Status: <span className= "green">Fixed</span></p> ;
     }

    return (
      <div>{print}</div>
  );
    }
}

 
export default withFirebase(AdminIssue);