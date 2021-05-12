import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//Import firebase
import firebase from '../Firebase';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

// Import boostrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';


if (window.location.hostname === "localhost") {
  // run on localhost server
  const auth = firebase.auth();
  const db = firebase.firestore();

  console.log("localhost detected!");
  auth.useEmulator("http://localhost:9099");
  db.useEmulator("localhost", 8080);
}

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
        title: "Created new Record!",
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
        console.error("Error adding document: ", error);
      });
  }

  // Update user for current status
  getUpdate() {
    swal("Enter the issue ID:", {
      content: "input",
    })
      .then((inputID) => {
        if (!inputID) {
          swal(`No input has been entered`);
        } else {
          var docRef = firebase.collection("users").doc(inputID)
          docRef.get().then((doc) => {
            var status = doc.data().fixed
            if (status === "False" && doc.exists) {
              swal({
                title: "Current Status: Work in Progress",
                text: "Record ID: " + docRef.id,
                icon: "info"
              })
            }
            else {
              swal({
                title: "Current Status: Work Completed",
                text: "Record ID: " + docRef.id,
                icon: "success"
              })
            }


          }).catch((error) => {
            swal({
              title: "ID was not found, check your input",
              text: "Record ID: " + docRef.id,
              icon: "warning"
            })
          })
        }

      });
  }

  geolocate() {

  }

  render() {
    const { name, desc, fixed, issue, created_at, location } = this.state;

    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              Log new issue
            </h3>
          </div>
          <div className="panel-body">
            <h4><Link to="/admin" className="btn btn-primary">View Logs</Link></h4>
            <h4><button onClick={this.getUpdate} className="btn btn-warning">Check log status</button></h4>
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
    );
  }
}

export default Create;