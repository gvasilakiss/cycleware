import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
      title: '',
      description: '',
      url: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('videos').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const video = doc.data();
        this.setState({
          key: doc.id,
          title: video.title,
          description: video.description,
          url: video.url
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState({ video: state });
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { title, description, url } = this.state;

    const updateRef = firebase.firestore().collection('videos').doc(this.state.key);
    updateRef.set({
      title,
      description,
      url
    }).then((docRef) => {
      this.setState({
        key: '',
        title: '',
        description: '',
        url: ''
      });
      this.props.history.push("/show/" + this.props.match.params.id)
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              EDIT video
            </h3>
          </div>
          <div className="panel-body">
            <h4><Link to={`/show/${this.state.key}`} className="btn btn-primary">video List</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label for="title">Title:</label>
                <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.onChange}
                  placeholder="Title" />
              </div>
              <div className="form-group">
                <label for="description">Description:</label>
                <input type="text" className="form-control" name="description" value={this.state.description} onChange={this.onChange}
                  placeholder="Description" />
              </div>
              <div className="form-group">
                <label for="url">URL:</label>
                <input type="text" className="form-control" name="url" value={this.state.url} onChange={this.onChange}
                  placeholder="url" />
              </div>
              <button type="submit" className="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;