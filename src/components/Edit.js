import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

import swal from 'sweetalert';

var db = firebase.firestore();

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
      name: '',
      desc: '',
      fixed: '',
      issue: '',
      location: '',
      created_at: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const problema = doc.data();
        const date = doc.data().created_at.toDate().toDateString();
        this.setState({
          key: doc.id,
          name: problema.name,
          desc: problema.desc,
          issue: problema.issue,
          fixed: problema.fixed,
          location: problema.location,
          created_at: date
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

    const { name, desc, fixed, issue, location } = this.state;

    const updateRef = db.collection('users').doc(this.state.key);
    updateRef.update({
      name,
      desc,
      fixed,
      issue,
      location
    }).then((docRef) => {
      swal({
        title: "Updated Record Successfully",
        text: "Record ID: " + this.state.key,
        icon: "success",
        timer: 2000,
        button: false
      })
      this.setState({
        key: '',
        name: '',
        desc: '',
        issue: '',
        fixed: '',
        location: '',
        created_at: ''
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
              Update Cycleway Issue
            </h3>
          </div>
          <div className="panel-body">
            <h4><Link to={`/show/${this.state.key}`} className="btn btn-primary">Issues List</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" className="form-control" name="name" value={this.state.name} onChange={this.onChange}
                  placeholder="name" />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input type="text" className="form-control" name="description" value={this.state.desc} onChange={this.onChange}
                  placeholder="Description" />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input type="text" className="form-control" name="location" value={this.state.location} onChange={this.onChange}
                  placeholder="Location" />
              </div>
              <div className="form-group">
                <label htmlFor="issue">Issue:</label>
                <input type="text" className="form-control" name="issue" value={this.state.issue} onChange={this.onChange}
                  placeholder="Issue" />
              </div>
              <div className="form-group">
                <label htmlFor="fixed">Fixed:</label>
                <input type="text" className="form-control" name="fixed" value={this.state.fixed} onChange={this.onChange}
                  placeholder="Status" />
              </div>
              <div className="form-group">
                <label htmlFor="created_at">Created at:</label>
                <input type="text" className="form-control" name="created_at" disabled={true} value={this.state.created_at} onChange={this.onChange}
                  placeholder="created at" />
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