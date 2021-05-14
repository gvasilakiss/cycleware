import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//Import firebase
import firebase from '../Firebase';

import swal from 'sweetalert';

import './index.css';

const db = firebase.firestore();
if (window.location.hostname === "localhost") {
  // run on localhost server
  const auth = firebase.auth();

  console.log("localhost detected!");
  auth.useEmulator("http://localhost:9099");
  db.useEmulator("localhost", 8080);
}

firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });

class Create extends Component {
  constructor() {
    super();
    this.getUpdate = this.getUpdate.bind(this);
    this.ref = firebase.firestore().collection('users');
    this.state = {
      name: '',
      desc: '',
      fixed: 'False',
      issue: '',
      location: '',
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
    const { name, desc, fixed, issue, created_at, location } = this.state;

    console.log(issue);

    if (issue.length === 0) {
      swal({
        title: "Missing Input✍",
        text: "You need to select an valid issue⚒",
        icon: "warning",
        timer: 2000,
        button: false
      })
    } else {
      this.ref.add({
        name,
        desc,
        fixed,
        issue,
        created_at,
        location
      }).then((docRef) => {
        this.setState({
          name: '',
          desc: '',
          fixed: 'False',
          issue: '',
          location,
          created_at: new Date()
        });
        swal({
          title: "Issue has been recorded🚀",
          text: "Record ID: " + docRef.id,
          icon: "success",
          timer: 1700,
          button: false
        }).then(() => {
          //redirect to admin page if authenticated user
          var user = firebase.auth().currentUser;
          if (window.location.pathname === "/create" && user) {
            this.props.history.push("/admin")
          }
          else {

          }
        });

      })
        .catch((error) => {
          swal({
            title: "Oups, seems we couldn't log that, try again.",
            text: "Error: " + error,
            icon: "error",
            timer: 1700,
            button: false
          });
        });
    }
  }

  // Update user for current status
  getUpdate() {
    swal("Enter the issue ID:", {
      content: "input",
    })
      .then((inputID) => {
        if (!inputID) {
          swal(`No input has been entered✍`);
        } else {
          var docRef = db.collection("users").doc(inputID)
          docRef.get().then((doc) => {
            var status = doc.data().fixed
            if (status === "False" && doc.exists) {
              swal({
                title: "Current Status: Work in Progress⚒",
                text: "Record ID: " + docRef.id,
                icon: "info"
              })
            }
            else {
              swal({
                title: "Current Status: Work Completed💥",
                text: "Record ID: " + docRef.id,
                icon: "success"
              })
            }


          }).catch((error) => {
            swal({
              title: "ID was not found, check your input❌",
              text: "Record ID: " + docRef.id,
              icon: "warning"
            })
          })
        }

      });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { name, desc, fixed, issue, created_at, location } = this.state;

    return (
      <div id="vertical-center" className="jumbotron">
        <div className="container">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h2 className="text-center">Cycleware🚴‍♂️ - See it, report it. </h2>
              <hr class="my-4" />
              <div className="d-flex">

                <div className="ml-auto p-2">
                  <h4><Link to="/admin" className="btn btn-primary">Admin Portal</Link></h4>
                </div>
              </div>
              <h3 className="panel-title">
                Log New Issue
            </h3>
            </div>
            <div className="panel-body">
              <div className="btn-group" role="group" aria-label="Third group">
                <h4><button onClick={this.getUpdate} className="btn btn-warning">Check log status</button></h4>
              </div>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Name:</label>
                  <input type="text" className="form-control" name="name" value={name} onChange={this.onChange} placeholder="Elon Musk👽" required />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Description of the issue:</label>
                  <input type="text" className="form-control" name="desc" value={desc} onChange={this.onChange} placeholder="Doge to the Moon🚀" required />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Issue Location</label>
                  <input type="text" className="form-control" name="location" value={location} onChange={this.onChange} placeholder="Enter location🌍" required />
                </div>
                <div className="form-group">
                  <label htmlFor="issue">Issue:</label>
                  <select name="issue" className="form-control" required value={this.state.value} onChange={this.onChange} >

                    <option value="Potholes">Potholes</option>
                    <option value="Graffiti">Graffiti</option>
                    <option value="Fly-Tipping">Fly-Tipping</option>
                    <option value="Cycle Route">Cycle Route Pothole</option>
                  </select>
                  {/* console.log(this.state.value) */}
                </div>

                <input type="hidden" id="issue_status" name="issue_status" value={fixed} />
                <button type="submit" className="btn btn-success">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;