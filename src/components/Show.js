import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

import swal from 'sweetalert';

class Show extends Component {

  constructor(props) {
    super(props);
    this.state = {
      issueLogged: {},
      key: ''
    };
  }

  componentDidMount() {
    this.authListener();
    //console.log(this.props.match.params.id)

  }

  // Check if user is logged in
  authListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
        ref.get().then((doc) => {
          //console.log(doc.data().created_at.toDate().toDateString());
          const dateStamp = doc.data().created_at.toDate().toDateString();
          if (doc.exists) {
            this.setState({
              issueLogged: doc.data(),
              key: doc.id,
              date: dateStamp,
              isLoading: false
            });
          } else {
            console.log("No such document!");
          }
        });
      } else {
        swal({
          title: "Ουπς, προμπλεμα",
          text: "Πρεπει πρωτα να συνδεθεις ρε.. ",
          icon: "error",
          timer: 1500,
          button: false
        }).then(this.props.history.push("/admin"));
      }
    })
  }

  delete(id) {
    swal("Do you want to delete this record?", {
      icon: "warning",
      buttons: {
        Yes: "Delete",
        No: "Cancel"
      },
    })
      .then((value) => {
        switch (value) {
          case "Yes":
            firebase.firestore().collection('users').doc(id).delete().then(() => {
              swal({
                title: "Deleted record",
                text: "Record ID: " + id,
                icon: "success",
                timer: 1700,
                button: false
              });
              this.props.history.push("/admin")
            }).catch((error) => {
              swal({
                title: "Error deleting record " + id,
                text: "Error: " + error,
                icon: "error"
              })
              console.error("Error removing document: ", error);
            });
            break;

          default:

        }
      });
  }

  render() {
    return (

      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <br />
            <h4><Link to="/admin" className="btn btn-primary">Back</Link></h4>
            <h3 className="panel-title">
              {this.state.issueLogged.issue} from {this.state.issueLogged.name} at {this.state.issueLogged.location}
            </h3>
          </div>
          <div className="panel-body">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" className="form-control" name="name" disabled={true} value={this.state.issueLogged.name}
                  placeholder="name" />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input type="text" className="form-control" name="description" disabled={true} value={this.state.issueLogged.desc}
                  placeholder="Description" />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input type="text" className="form-control" name="location" disabled={true} value={this.state.issueLogged.location}
                  placeholder="Location" />
              </div>
              <div className="form-group">
                <label htmlFor="issue">Issue:</label>
                <input type="text" className="form-control" name="issue" disabled={true} value={this.state.issueLogged.issue}
                  placeholder="Issue" />
              </div>
              <div className="form-group">
                <label htmlFor="fixed">Fixed:</label>
                <input type="text" className="form-control" name="fixed" disabled={true} value={this.state.issueLogged.fixed}
                  placeholder="Status" />
              </div>
              <div className="form-group">
                <label htmlFor="created_at">Created at:</label>
                <input type="text" className="form-control" name="created_at" disabled={true} value={this.state.date}
                  placeholder="created at" />
              </div>
            </form>
            <Link to={`/edit/${this.state.key}`} className="btn btn-success">Update Details</Link>&nbsp;
            <button onClick={this.delete.bind(this, this.state.key)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>

    );
  }
}

export default Show;