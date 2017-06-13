import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
//import { findDOMNode } from 'react-dom';
import $ from 'jquery';

/*
 * Build RecordBox Component
 */
class RecordBox extends Component {

  constructor() {
    super();

    this.state = {
      showComments: false,
      records: []
    };
  }
  componentWillMount(){
    this._fetchRecords();
  }
  render(){
    const records = this._getComments();
    return (
      <div className="comment-box">
        <RecordForm addComment={this._addComment.bind(this)} />
        {this._getPopularMessage(records.length)}
        <h4 className="comment-count">{this._getRecordsTitle(records.length)}</h4>
        <p><b>{this._getPopularMessage()}</b></p>
        <div className="comment-list">
          {records}
        </div>
      </div>
    );
  }

  // start polling process
  componentDidMount(){
    this._timer = setInterval(() => this._fetchRecords(), 5000);
  }
  /////

  componentWillUnmount() {
    clearInterval(this._timer);
  }


  _getPopularMessage(recordCount){
    const POPULAR_COUNT = 10;

    if (recordCount > POPULAR_COUNT) {
      return (
        <b>Post is popular!</b>
      );
    } else if (recordCount < POPULAR_COUNT) {
      return (
        <b>Post is average</b>
      );
    }
  }

  _getRecordsTitle(recordCount) {
    if (recordCount === 0) {
      return 'No Results.';
    } else if (recordCount === 1) {
      return '1 Result';
    } else {
      return `${recordCount} Results`;
    }
  }

  _addComment(author,body) {
    // Create object
    const comment = {author,body};

    //$.post('http://apidata:8888/data.json', {comment})
    //  .success(newComment => {
    //    this.setState({ records: this.state.records.concat([newComment]) });
    //});
    $.ajax({
      method: 'POST',
      url: 'http://apidata:8888/data.json',
      success: () => {
        this.setState({ records: this.state.records.concat([comment])  });
      },
      error: () => {
        console.log('error');
      }
    });

    //let comment = {
    //  id: Math.floor(Math.random() * (9999 - this.state.records.length + 1)) + this.state.records.length,
    //  author: author,
    //  body: body,
    //  avatarUrl: 'http://lorempixel.com/400/200/'
    //};
    //
    //this.setState({
    //  records: this.state.records.concat([comment])
    //});
  }

  // API Call
  _fetchRecords() {
    $.ajax({
      method: 'GET',
      url: 'http://apidata:8888/data.json',
      success: (records) => {
        this.setState({ records });
      },
      error: () => {
        console.log('error');
      }
    });
  }
  _deleteComment(comment){
    $.ajax({
      method: 'DELETE',
      url: `http://apidata:8888/data.json/${comment.id}`
    })
  }

  _getComments() {
    return this.state.records.map((comment) => {
      return <Comment
        id={comment.id}
        author={comment.author}
        email={comment.email}
        body={comment["Contractor Name"]}
        key={comment.id}
        onDelete={this._deleteComment.bind(this)}/>
    });
  }


}

/*
 * Build Comment Component
 */
class Comment extends Component {

  constructor(){
    super();
    this.state= {
      isAbusive: false
    }
  }


  render() {
    let commentBody;

    if(!this.state.isAbusive) {
      commentBody = this.props.body;
    } else {
      commentBody = <em>Content marked as abusive</em>;
    }

    return (
      <div className="comment">
        <p className="comment-header">Title: {this.props.author}</p>
        <p className="comment-body">
          Body: {commentBody}
        </p>
        <p>
          Email: {this.props.email}
        </p>
        <div className="comment-actions">
          <a href="#">
            Show More
          </a>
          <br />
          <a onClick={this._toggleAbuse.bind(this)} href="#">Report Abuse</a>
        </div>
      </div>
    );
  }

  _handleDelete(event){
    event.preventDefault();
    this.props.onDelete(this.props.comment);
    //var result = ("Are you sure?");
    //if (result) {
    //  this.props.onDelete(this.props.comment);
    //}

  }

  _toggleAbuse(event){
    event.preventDefault();
    this.state({
      isAbusive: !this.state.isAbusive
    });
  }

}

class RemoveCommentConfirmation extends Component {
  constructor() {
    super();

    this.state = {
      showConfirm: false
      }
  }

}


class RecordForm extends Component {
  render(){
    return (
      <form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
        <label>Discussion</label>
        <div className="comment-form-fields">
          <input
            ref={(input) => this._author = input}
            type="text"
            placeholder="Name:" />
          <textarea
            ref={(textarea) => this._body = textarea}
            type="text"
            onKeyUp={this._getCharacterCount.bind(this)}
            placeholder="Comment:"></textarea>
        </div>
        <div className="comment-form-actions">
          <button type="submit">
            Post comment
            </button>
          </div>
      </form>
    );
  }

  _getCharacterCount(){
    this.setState({
      characters: this._body.value.length
    });
  }

  _handleSubmit(event){
    event.preventDefault();

    if (!this._author.value || !this._body.value) {
      alert('Please enter your name and comment');
      return;
    }


    let author = this._author;
    let body = this._body;

    this.props.addComment(author.value, body.value);
  }
}

class CommentAvatarList extends Component{
  render(){
    const { avatars = []} = this.props;
    return(
      <div className="comment-avatars">
        <h4>Authors</h4>
        <ul>
          {avatars.map((avatarUrl, i) =>(
            <li key={i}>
              <img height="100px" src={avatarUrl} />
            </li>
          ))}
        </ul>
      </div>
    )

  }
}

export default RecordBox;
