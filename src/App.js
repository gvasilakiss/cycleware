import React, { Component } from 'react';

import Login from "./login";
import Admin from "./admin";
import firebase from './Firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };

    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    })
  }

  render() {
    return (

      <div className="App">
        { this.state.user ? (<Admin />) : (<Login />)}
      </div>

    );
  }
}

export default App;