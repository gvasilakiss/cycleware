import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      key: '',
      name: '',
      desc: '',
      fixed: '',
      issue: '',
      created_at: ''
    };
  }

  componentDidMount() {
    const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const problema = doc.data();
        this.setState({
          key: doc.id,
          name: problema.name,
          desc: problema.desc,
          issue: problema.issue,
          isfixed: problema.fixed,
          created_at: doc.data().created_at.toDate().toDateString()
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

    const { name, desc, fixed, issue, created_at } = this.state;

    const updateRef = firebase.firestore().collection('users').doc(this.state.key);
    updateRef.set({
      name,
      desc,
      fixed,
      issue,
      created_at
    }).then((docRef) => {
      this.setState({
        key: '',
        name: '',
        desc: '',
        issue: '',
        fixed: '',
        created_at: this.docRef.data().created_at.toDate().toDateString()
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
                <label htmlFor="issue">Issue:</label>
                <input type="text" className="form-control" name="issue" value={this.state.issue} onChange={this.onChange}
                  placeholder="url" />
              </div>
              <div className="form-group">
                <label htmlFor="url">URL:</label>
                <input type="text" className="form-control" name="url" value={this.state.url} onChange={this.onChange}
                  placeholder="url" />
              </div>
              <div className="form-group">
                <label htmlFor="url">Created at:</label>
                <input type="text" className="form-control" name="url" disabled={true} value={this.state.created_at} onChange={this.onChange}
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