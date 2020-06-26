import React, { Component } from 'react';
import {withFirebase} from './Firebase';

class Announcements extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var dd = (today.getDate() < 10 ? '0' : '') + today.getDate(); 
    var MM = ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1); 
    var date = dd + '-' + MM + '-' + today.getFullYear() ;

    this.state = {
      noticeDate: date,
      noticeDescription: '',
      noticeId: '',
      noticePdf: null,
      noticePdfUrl: '',
      noticeTitle: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
    this.handleChanger = this.handleChanger.bind(this);
  }
  handleChanger(e) {
    if (e.target.files[0]) {
      const noticePdf = e.target.files[0];
      this.setState(() => ({ noticePdf }));
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
    const { noticePdf } = this.state;
    var date = new Date();
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate(); 
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1); 
    const noticeName = 'notice_'+dd+MM+date.getFullYear()+date.getHours()+date.getMinutes()+date.getSeconds();
    const uploadTask = storage.ref(`notice/${noticeName}`).put(noticePdf);
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
          .ref("notice")
          .child(noticeName)
          .getDownloadURL()
          .then(url => {
            this.setState({noticePdfUrl: url});
            const itemsRef = this.props.firebase.database.ref('noticeboard/');
            const item = {
              noticeDate: this.state.noticeDate,
              noticeDescription: this.state.noticeDescription,
              noticeId: '',
              noticePdfUrl: this.state.noticePdfUrl,
              noticeTitle: this.state.noticeTitle
            }
            var place = itemsRef.push(item);
            itemsRef.child(place.key).update({'noticeId': place.key});
            this.setState({
              noticeDate: '',
              noticeDescription: '',
              noticeId: '',
              noticePdf: null,
              noticePdfUrl: '',
              noticeTitle: ''
            });
          });
      }
    );
    //initially everything was placed here, but the noticeurl was getting updated before upload to storage hence this way
  }
  render() {
    return (
      <div>
        <header>
            <div>
              <h1 className="uk-heading-small">Notice board</h1>
            </div>
        </header>
        <div>
        <div className="uk-container uk-container-small">
          <form className="uk-form-horizontal uk-margin-large" onSubmit={this.handleSubmit}>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-text">Notice Title:</label>
              <div className="uk-form-controls">
                <input className="uk-input" id="form-horizontal-text" type="text" name="noticeTitle" value={this.state.value} onChange={this.handleChange}/>
              </div>
            </div>
            
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-text">Notice Description:</label>
              <div className="uk-form-controls">
                <textarea className="uk-textarea" name='noticeDescription' value={this.state.value} onChange={this.handleChange} />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" for="form-horizontal-text">Upload Notice PDF:</label>
              <div className="uk-form-controls">
              <input type="file" onChange={this.handleChanger}/>
              </div>
            </div>
            <div className="uk-margin">
              <div className="uk-form-controls">
              <input className="uk-button uk-align-center" type="submit" value="Publish Notice"/>
              </div>
            </div>
          </form>
             </div>
        </div>
      </div>
    );
  }
}
export default withFirebase(Announcements);