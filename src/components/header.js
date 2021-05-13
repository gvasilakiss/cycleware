import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link to="/" className="navbar-brand">Cycleware</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-auto" >
                            <li className="nav-item">
                                <Link to="/admin" className="btn btn-primary">View Logs</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={this.getUpdate} className="btn btn-warning">Check log status</button>
                            </li>
                        </ul>
                    </div>
                </nav >
            </div >
        )
    }
}
