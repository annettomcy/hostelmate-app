import React, { Component } from 'react';
import { compose } from 'recompose';
import {withFirebase} from './Firebase';
import {withAuthorization} from './Session';

class NoticeBoard extends Component {
  constructor(props){
    super(props);
    this.state = {
      notices: []
      };
  };
  componentDidMount(){
    const noticeRef = this.props.firebase.database.ref('noticeboard/');
    noticeRef.once('value', (snapshot) => {
      let noticesnap = snapshot.val();
      let newState = [];
      for (let notice in noticesnap){
        newState.push({
          noticeDate: noticesnap[notice].noticeDate,
          noticeDescription: noticesnap[notice].noticeDescription,
          noticePdfUrl: noticesnap[notice].noticePdfUrl,
          noticeTitle: noticesnap[notice].noticeTitle
        });
      }
      this.setState({notices: newState}); 
    });
  };
  render(){
    return(
      <div className = "uk-container">
        <h1 className="uk-text-center" style={{paddingBottom: '30px'}}>Notice Board</h1>
        {this.state.notices.map((notice)=>{
          return(
            <div className="uk-container-small uk-align-center">
              <div className="uk-column-1-2 uk-column-divider">
                  <div>
                    <h3>{notice.noticeTitle}</h3>
                    <p>Date of notice: {notice.noticeDate}</p>
                    <p>Notice Description: {notice.noticeDescription}</p>
                  </div>
                  <div>
                    <p></p>
                    <a href={notice.noticePdfUrl} target="_blank" rel="noopener noreferrer" download>Download PDF <span uk-icon="download"></span></a>
                  </div>
              </div>
              <hr/>
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
  withAuthorization(condition),
  withFirebase,
)(NoticeBoard);