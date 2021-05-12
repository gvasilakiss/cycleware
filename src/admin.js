import React, { Component } from 'react';

import firebase from './Firebase';
import Thumbnail from './components/Thumbnail';
import swal from 'sweetalert';

import { Switch, Route, Link } from "react-router-dom";

const db = firebase.firestore();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        this.state = {
            issues: []
        };
    }

    onCollectionUpdate = (querySnapshot) => {
        const issues = [];
        querySnapshot.forEach((loggedIssue) => {
            // Convert timestamp to date
            const date = loggedIssue.data().created_at.toDate().toDateString();
            const { name, issue, desc, location } = loggedIssue.data();
            const createdAt = date;
            // Set status in table
            if (loggedIssue.data().fixed === "False") {
                var fixed = 'Work in Progress';
            } else if (loggedIssue.data().fixed === "True") {
                fixed = 'Work Completed'
            }
            else {
                fixed = "Unknown Status"
            }
            issues.push({
                key: loggedIssue.id,
                loggedIssue, // DocumentSnapshot
                name,
                issue,
                desc,
                fixed,
                location,
                createdAt
            });
        });
        this.setState({
            issues
        });
    }

    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    logout() {
        firebase.auth().signOut().then(() => {
            window.location = '/';
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
                    var docRef = db.collection("users").doc(inputID)
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

                        console.log("Current data: ", doc.data());
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

    render() {
        return (

            <div className="container">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">
                            Road Issues
            </h3>
                    </div>
                    <div className="panel-body">
                        <h4><Link to="/create" className="btn btn-primary">Create new Issue</Link></h4>
                        <h4><button onClick={this.getUpdate} className="btn btn-warning">Check log status</button></h4>
                        <table className="table table-stripe">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Issue</th>
                                    <th>location</th>
                                    <th>Created at</th>
                                    <th>ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.issues.map(problema =>
                                    <tr key={problema.key}>

                                        <td><Link to={`/show/${problema.key}`}>{problema.name}</Link></td>
                                        <td>{problema.desc}</td>
                                        <td>{problema.fixed}</td>
                                        <td>{problema.issue}</td>
                                        <td>{problema.location}</td>
                                        <td>{problema.createdAt}</td>
                                        <td>{problema.key}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button type="button" class="btn btn-primary" onClick={this.logout}>Log Out</button>
                </div>
            </div>
        );
    }
}