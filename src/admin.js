import React, { Component } from 'react';

import firebase from './Firebase';
import Thumbnail from './components/Thumbnail';

import { Switch, Route, Link } from "react-router-dom";

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
            const { name, issue, desc, fixed } = loggedIssue.data();
            const createdAt = date;
            issues.push({
                key: loggedIssue.id,
                loggedIssue, // DocumentSnapshot
                name,
                issue,
                desc,
                fixed,
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
        firebase.auth().signOut();
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
                        <table className="table table-stripe">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Is fixed</th>
                                    <th>Issue</th>
                                    <th>Created at</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.issues.map(problema =>
                                    <tr key={problema.key}>

                                        <td><Link to={`/show/${problema.key}`}><Thumbnail img={problema.url} /></Link></td>
                                        <td><Link to={`/show/${problema.key}`}>{problema.name}</Link></td>
                                        <td>{problema.desc}</td>
                                        <td>{problema.fixed}</td>
                                        <td>{problema.issue}</td>
                                        <td>{problema.createdAt}</td>
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