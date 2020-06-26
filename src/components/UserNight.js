import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import {withAuthorization} from './Session';
import './Admin/AdminIssue.css'
//For routing to add nightstudy page
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
  
class UserNight extends Component {
  constructor(props){
    super(props);
    this.state = {
        loading: false,
        nightStudys: []
    };
    this.handleClick = this.handleClick.bind(this);
  };
  handleClick(e){
      e.preventDefault();
      this.props.history.push(ROUTES.NIGHT_STUDY);
  }
  shouldComponentUpdate() {
    return true;
  }
  componentDidMount(){
    this.setState({ loading: true });
    const studyRef = this.props.firebase.database.ref('nightstudy/');
    studyRef.on('value', (snapshot) => {
    let nightStudysnap = snapshot.val();
    let newState = [];
    for (let nightStudy in nightStudysnap){
        if(nightStudysnap[nightStudy].nightStudyReportedBy===this.props.firebase.auth.currentUser.email){
            newState.push({
                nightStudyBlock: nightStudysnap[nightStudy].nightStudyBlock,
                nightStudyDate: nightStudysnap[nightStudy].nightStudyDate,
                nightStudyReason: nightStudysnap[nightStudy].nightStudyDescription,
                nightStudyId: nightStudysnap[nightStudy].nightStudyId,
                nightStudyReasonForRejection: nightStudysnap[nightStudy].nightStudyReasonForRejection,
                nightStudyReportedBy: nightStudysnap[nightStudy].nightStudyReportedBy,
                nightStudyRoom: nightStudysnap[nightStudy].nightStudyRoom,
                nightStudyStatus: nightStudysnap[nightStudy].nightStudyStatus, 
                nightStudyTitle: nightStudysnap[nightStudy].nightStudyTitle
            });
        }
        }
    this.setState({ loading: false });
    this.setState({nightStudys: newState}); 
    });
    
  };
  componentWillUnmount(){
    this.props.firebase.database.ref('nightstudy/').off();
  }
  render(){
    return(
      <div className="uk-container">
        <h2>Night Study Requests</h2>
        <button style={{borderRadius: "30px"}} onClick = {this.handleClick}><span className="uk-icon-button" uk-icon="plus-circle"></span>Request for Night Study</button>
        {this.state.nightStudys.map((nightStudy)=>{   
            let stat;
            if(nightStudy.nightStudyStatus === "Pending"|| nightStudy.nightStudyStatus === "pending")
            stat =  <p>Night Study Status: <span className="yellow">{nightStudy.nightStudyStatus}</span></p> ;
            else if(nightStudy.nightStudyStatus === "Approved" || nightStudy.nightStudyStatus === "approved")
                stat = <p>Night Study Status: <span className="green">{nightStudy.nightStudyStatus}</span></p> ;
            else 
                stat = <p>Night Study Status: <span className="red">{nightStudy.nightStudyStatus}</span></p>;   
          return(
            <div className="uk-container cards">
            <div className="uk-card uk-card-secondary uk-grid">
              <div className="uk-card-body uk-width-1-2">
                <h3 className="uk-card-title">{nightStudy.nightStudyTitle}</h3>
                <p>Date of Night Study: {nightStudy.nightStudyDate}</p>
                <p>Night Study Reason: {nightStudy.nightStudyReason}</p>
                <p>Night Study Block: {nightStudy.nightStudyBlock}</p>
                <p>Night Study Room: {nightStudy.nightStudyRoom}</p>
                {stat}
                {nightStudy.nightStudyStatus === "Rejected" || nightStudy.nightStudyStatus === "rejected"? <p>Reason For Rejection: {nightStudy.nightStudyReasonForRejection}</p>:<p></p>}
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
    )(UserNight);