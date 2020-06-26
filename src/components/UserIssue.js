import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import {withAuthorization} from './Session';
import './Admin/AdminIssue.css'
//For routing to add issue page
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
  
class UserIssue extends Component {
  constructor(props){
    super(props);
    this.state = {
        loading: false,
        issues: []
    };
    this.handleClick = this.handleClick.bind(this);
  };
  handleClick(e){
      e.preventDefault();
      this.props.history.push(ROUTES.ISSUE_PAGE);
  }
  shouldComponentUpdate() {
    return true;
  }
  componentDidMount(){
    this.setState({ loading: true });
    const issueRef = this.props.firebase.database.ref('issues/');
    issueRef.on('value', (snapshot) => {
    let issuesnap = snapshot.val();
    let newState = [];
    for (let issue in issuesnap){
        if(issuesnap[issue].issueReportedBy===this.props.firebase.auth.currentUser.email){
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
        }
    this.setState({ loading: false });
    this.setState({issues: newState}); 
    });
    
  };
  componentWillUnmount(){
    this.props.firebase.database.ref('issues/').off();
  }
  render(){
    return(
      <div className = "uk-container">
        <h2>Reported Issues</h2>
        <button style={{borderRadius: "30px"}} onClick = {this.handleClick}><span className="uk-icon-button" uk-icon="plus-circle"></span>Add new issue</button>
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
                        <p>{issue.issueStatus === "Fixed"? <IssueFixed/>:<IssueNotFixed/>}</p>
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
const IssueNotFixed=()=>(
    <p>Issue Status: <span className= "red">Not Fixed</span></p>
);


const condition = authUser => !! authUser;
export default compose(
    withRouter,
    withFirebase,
    withAuthorization(condition)
  )(UserIssue);