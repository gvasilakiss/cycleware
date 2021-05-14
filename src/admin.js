import React, { Component } from 'react';

import firebase from './Firebase';
import swal from 'sweetalert';

import { Link } from "react-router-dom";

const db = firebase.firestore();

export default class App extends Component {
    constructor(props) {
        // Get current user
        var user = firebase.auth().currentUser;

        super(props);
        this.ref = firebase.firestore().collection('users');
        this.unsubscribe = null;
        this.user = user
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
                var fixed = 'Work in Progress⚒';
            } else if (loggedIssue.data().fixed === "True") {
                fixed = 'Work Completed💥'
            }
            else {
                fixed = "Unknown Status❌"
            }
            issues.push({
                key: loggedIssue.id,
                loggedIssue,
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
                                title: "Current Status: Work in Progress⚒",
                                text: "Record ID: " + doc.id,
                                icon: "info"
                            })
                        }
                        else {
                            swal({
                                title: "Current Status: Work Completed💥",
                                text: "Record ID: " + doc.id,
                                icon: "success"
                            })
                        }

                        // eslint-disable-next-line no-lone-blocks
                        { /*console.log("Current data: ", doc.data()) */ }

                    }).catch((error) => {
                        swal({
                            title: "ID was not found, check your input👨‍💻",
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
                        <h2 className="text-center">Cycleware🚴‍♂️ - See it, report it. </h2>
                        <hr class="my-4" />
                        <div className="d-flex">
                            <h5 className="text-center">Welcome back, <span id="user"> {this.user.displayName}</span></h5>
                            <div className="ml-auto p-2">
                                <button type="button" className="btn btn-dark" onClick={this.logout}>Log Out</button>
                            </div>
                        </div>

                        <div>

                        </div>
                        <h2 className="panel-title text-center">Cycleway Reported Issues🚧</h2>
                    </div>
                    <div className="panel-body">
                        <div className="btn-group mr-2" role="group" aria-label="Third group">
                            <h4><Link to="/create" className="btn btn-primary">Report new issue</Link></h4>
                        </div>
                        <div className="btn-group" role="group" aria-label="Third group">
                            <h4><button onClick={this.getUpdate} className="btn btn-warning">Check log status</button></h4>
                        </div>
                        <table className="table table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Issue</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Created at</th>
                                    <th scope="col">ID</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.issues.map(problema =>
                                    <tr key={problema.key}>
                                        <th scope="row">{problema.issue}</th>
                                        <td>{problema.name}</td>
                                        <td>{problema.desc}</td>
                                        <td>{problema.fixed}</td>
                                        <td>{problema.location}</td>
                                        <td>{problema.createdAt}</td>
                                        <td type="button" onClick={() => { navigator.clipboard.writeText(problema.key) }}>{problema.key}</td>
                                        <td><Link type="button" className="btn btn-info" to={`/show/${problema.key}`}>Edit</Link></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}