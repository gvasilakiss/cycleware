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
    console.log(this.props.match.params.id)
    const ref = firebase.firestore().collection('users').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      console.log(doc.data().created_at.toDate().toDateString());
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
  }

  delete(id) {
    swal("Do you want to delete this record?", {
      icon: "warning",
      buttons: {
        Yes: "Delete",
        No: {
          text: "Cancel",
          value: "catch",
        }
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

          case "No":
            swal("Gotcha!", "Pikachu was caught!", "success");
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
            <dl>
              <dt>Name:</dt>
              <dd>{this.state.issueLogged.name}</dd>
              <dt>Description:</dt>
              <dd>{this.state.issueLogged.desc}</dd>
              <dt>Issue:</dt>
              <dd>{this.state.issueLogged.issue}</dd>
              <dt>Status:</dt>
              <dd>{this.state.issueLogged.fixed}</dd>
              <dt>Location:</dt>
              <dd>{this.state.issueLogged.location}</dd>
              <dt>Created:</dt>
              <dd>{this.state.date}</dd>
            </dl>
            <Link to={`/edit/${this.state.key}`} className="btn btn-success">Update Details</Link>&nbsp;
            <button onClick={this.delete.bind(this, this.state.key)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>

    );
  }
}

export default Show;