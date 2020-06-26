import React, { Component } from 'react';
import {withFirebase} from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import {compose} from 'recompose';
import './AdminIssue.css'

class AdminFeedback extends Component {
  constructor(props){
    super(props);
    this.state = {
      feedback: [],
      comments: []
      };
  };
  
  componentDidMount(){
    let newState =[], newOne=[];
    let cleaningTotal=0, foodTotal=0, clobj={}, fobj={}, add=0;
    const itemsRef = this.props.firebase.database.ref('feedback/');
    itemsRef.on('value', (snapshot) => {
      let itemsnap = snapshot.val();
      console.log(Object.keys(itemsnap));
      Object.keys(itemsnap).map((key) => {
        let item = itemsnap[key];
        cleaningTotal=0; foodTotal=0; add=0;
        Object.keys(item).map((keey) =>{
          newOne.push({
            month: key,
            foodComments: item[keey].foodReview,
            cleaningComments: item[keey].cleaningReview,
            feedbackFrom: item[keey].feedbackFrom
          });
          cleaningTotal+=item[keey].cleaningRating;
          foodTotal+=item[keey].foodRating;
          add+=1;
        });
        clobj[key] = ((cleaningTotal/add)/5)*100;
        fobj[key] = ((foodTotal/add)/5)*100;
        newState.push({
          month: key,
          cleaningRate: clobj[key],
          foodRate: fobj[key]
        });
        
      });
      this.setState({feedback: newState, comments: newOne});
    });
  };
  componentWillUnmount() {
    this.props.firebase.database.ref().off('value');
  }
  render(){
    return(
      <div className="uk-container">
        <h2 className="uk-text-center">Feedback Review</h2>
        {this.state.feedback.map((rate)=>{
          return(
            <div className="uk-card uk-card-secondary uk-card-hover uk-card-body uk-light uk-width-1-2@m uk-align-center">
              <h3 className="uk-card-title">{rate.month}<button uk-toggle="target: #my-id" uk-icon="more" style={{color: 'white', float: 'right'}}></button></h3>
              <p>Food Rating for the month: {rate.foodRate}/100</p>
              <p>Cleaning Rating for the month: {rate.cleaningRate}/100</p>
              <div id="my-id" hidden>
                <Comments month={rate.month} comments={this.state.comments}/>
              </div>
            </div>
          );
        }
          )}  
      </div>
    );
  }
}
class Comments extends Component{
  constructor(props){
    super(props);
  }
  render(){ 
   return(
     <div>
       {this.props.comments.map((rate)=>{
         if(this.props.month === rate.month){
           return(
             <div>
               <hr/>
               <p>Feedback from: {rate.feedbackFrom}</p>
               <p>Food Comments: {rate.foodComments}</p>
               <p>Cleaning Comments: {rate.cleaningComments}</p>
             </div>
           );
         }
       })
       }
     </div>
   ); 
  }
}


const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN];
 
export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminFeedback);