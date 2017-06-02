import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';


/*
 * Build CommentBox Component
 */
class CommentBox extends Component {
  render(){
    const comments = this._getComments() || [];
    return (
      <div className="comment-box">
        <CommentForm addComment={this._addComment.bind(this)} />
        <hr />
        <h3>Comments</h3>
        {this._getPopularMessage(comments.length)}
        <h4 className="comment-count">{this._getCommentsTitle(comments.length)}</h4>
        <p><b>{this._getPopularMessage()}</b></p>
        <div className="comment-list">
          {comments}
        </div>
      </div>
    );
  }


  // My methods
  _fetchComments() {
    
  }

  _addComment(author,body) {
    const comment = {
      id: this.state.comments.length + 1,
      author,
      body
    };
    this.setState({ comments: this.state.comments.concat([comment])});
  }

  constructor() {
    super();
    this.state = {
      showComments: false,
      comments: [  ]
    }
  }

  _getComments() {
  //  const commentList = [
  //    { id: 1, author: 'Clu', body: 'Just say no to love!!', avatarUrl: 'https://placeimg.com/200/240/any' },
  //    { id: 2, author: 'Anne Droid', body: 'I wanna know what love is...', avatarUrl: 'https://placeimg.com/200/240/any' },
  //    { id: 3, author: 'Bill Droid', body: 'Whats happening', avatarUrl: 'https://placeimg.com/200/240/any' }
  //
  //  ];

    return this.state.comments.map((comment) => {
      return (
        <Comment author={comment.author} body={comment.body} avatarUrl={comment.avatarUrl} key={comment.id} />
      )
    });
  }

  _getPopularMessage(commentCount){
    const POPULAR_COUNT = 10;

    if (commentCount > POPULAR_COUNT) {
      return (
        <b>Post is popular!</b>
      );
    } else if (commentCount < POPULAR_COUNT) {
      return (
        <b>Post is average</b>
      );
    }
  }

  _getCommentsTitle(commentCount) {
    if (commentCount === 0) {
      return 'No comments yet.';
    } else if (commentCount === 1) {
      return '1 comment';
    } else {
      return `${commentCount} comments`;
    }
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
        <img alt={`${this.props.author}'s picture`} src={this.props.avatarUrl}/>
        <p className="comment-header">{this.props.author}</p>
        <p className="comment-body">
          {commentBody}
        </p>
        <div className="comment-actions">
          <a href="#">Delete comment</a><br />
          <a onClick={this._toggleAbuse.bind(this)} href="#">Report Abuse</a>
        </div>
      </div>
    );
  }

  _toggleAbuse(event){
    event.preventDefault();
    this.state({
      isAbusive: !this.state.isAbusive
    });
  }

}

class CommentForm extends Component {
  render(){
    return (
      <form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
        <label>Discussion</label>
        <div className="comment-form-fields">
          <input ref={(input) => this._author = input} type="text" placeholder="Name:" />
          <textarea
            ref={(textarea) => this._body = textarea}
            type="text"
            onkeyup={this._getCharacterCount.bind(this)}
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

export default CommentBox;
