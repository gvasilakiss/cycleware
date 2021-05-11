import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//Import firebase
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Create extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('users');
    this.state = {
      name: '',
      desc: '',
      fixed: 'False',
      issue: '',
      created_at: new Date()
    };
  }

  // onChange
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState({ value: e.target.value })
  }

  // OnSubmit
  onSubmit = (e) => {
    e.preventDefault();
    const { name, desc, fixed, issue, created_at } = this.state;

    this.ref.add({
      name,
      desc,
      fixed,
      issue,
      created_at
    }).then((docRef) => {
      this.setState({
        name: '',
        desc: '',
        fixed: 'False',
        issue: '',
        created_at: new Date()
      });
      this.props.history.push("/")
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    const { name, desc, fixed, issue, created_at } = this.state;
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              Add video
            </h3>
          </div>
          <div className="panel-body">
            <h4><Link to="/" className="btn btn-primary">Video List</Link></h4>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="title">Name:</label>
                <input type="text" className="form-control" name="name" value={name} onChange={this.onChange} placeholder="name" />
              </div>
              <div className="form-group">
                <label htmlFor="title">Desc:</label>
                <input type="text" className="form-control" name="desc" value={desc} onChange={this.onChange} placeholder="desc" />
              </div>
              <div className="form-group">
                <label htmlFor="issues">Issue:</label>
                <select value={this.state.value}
                  onChange={this.onChange}
                >
                  <option value="Orange">Orange</option>
                  <option value="Radish">Radish</option>
                  <option value="Cherry">Cherry</option>
                </select>
                {console.log(this.state.value)}
              </div>
              <input type="hidden" id="issue_status" name="issue_status" value={fixed} />
              <button type="submit" className="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );

  }
}

export default Create;