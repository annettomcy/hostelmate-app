import React, { Component } from 'react';
import {withFirebase} from './Firebase';
import { withAuthorization } from './Session';
//For routing back user issue page
import { compose } from 'recompose';
import StarRatingComponent from 'react-star-rating-component';

class Feedback extends Component{
  constructor(props){
    super(props);
    this.state = {  
      cleaningRating: 0,
      cleaningReview: '',
      feedbackFrom: '',
      foodRating: 0,
      foodReview: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  onStarClickF(nextValue, prevValue, name) {
    this.setState({foodRating: nextValue});
  }
  onStarClickC(nextValue, prevValue, name) {
    this.setState({cleaningRating: nextValue});
  }
  handleSubmit(e) {
    e.preventDefault();
    var date=new Date();
    var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
    var MM =  date.getFullYear()+'_'+((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)+ month[date.getMonth()];
    var myEmail = this.props.firebase.auth.currentUser.email.replace(/\./g,'_');
    const itemsRef = this.props.firebase.database.ref('feedback/' +  MM + '/' + myEmail);
      itemsRef.set({
      cleaningRating: this.state.cleaningRating,
      cleaningReview: this.state.cleaningReview,
      feedbackFrom: myEmail,
      foodRating: this.state.foodRating,
      foodReview: this.state.foodReview
    });
    this.setState({
      cleaningRating: 0,
      cleaningReview: '',
      feedbackFrom: '',
      foodRating: 0,
      foodReview: ''
    });
  }
  render(){
    const { cleaningRating } = this.state;
    const { foodRating } = this.state;
    const isInvalid =
      this.state.foodRating === 0 ||
      this.state.cleaningRating === 0 ||
      this.state.foodReview === '' ||
      this.state.cleaningReview === '';
    return(
      <div className="uk-container">
      <div className="uk-container uk-container-small">
      <h1 className="uk-align-center uk-text-center">Feedback Form</h1>
      <form className="uk-form-horizontal uk-margin-large" onSubmit={this.handleSubmit}>
        <div className="uk-margin">
          <div className="uk-form-controls uk-text-large">
          <label className="uk-form-label" for="form-horizontal-text">Food Review:</label>
          <StarRatingComponent 
          name="foodRating" 
          starCount={5}
          value={foodRating}
          onStarClick={this.onStarClickF.bind(this)}
        />
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-form-controls">
            <textarea className="uk-textarea" name='foodReview' value={this.state.value} onChange={this.handleChange} />
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-form-controls uk-text-large">
          <label className="uk-form-label" for="form-horizontal-text">Cleaning Review:</label>
          <StarRatingComponent 
          name="cleaningRating" 
          starCount={5}
          value={cleaningRating}
          onStarClick={this.onStarClickC.bind(this)}
        />
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-form-controls">
            <textarea className="uk-textarea" name='cleaningReview' value={this.state.value} onChange={this.handleChange} />
          </div>
        </div>
        <div className="uk-margin">
          <div className="uk-form-controls">
            <button className="uk-button uk-align-center" disabled={isInvalid} type="submit">Submit Feedback</button>
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
    withFirebase,
    withAuthorization(condition)
  )(Feedback);