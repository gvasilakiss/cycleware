import React, { Component } from 'react';

import Login from "./login";
import Admin from "./admin";
import firebase from './Firebase';

//Import alerts library
import swal from 'sweetalert';

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
        swal({
          title: "Ουπς, προμπλεμα",
          text: "Πρεπει πρωτα να συνδεθεις ρε.. ",
          icon: "error",
          timer: 1500,
          button: false
        }).then(this.setState({ user: null }));
      }
    })
  }

  render() {
    return (
      //If user is logged in redirect to admin page else to login
      <div className="App">
        <br></br>
        { this.state.user ? (<Admin />) : (<Login />)}
      </div>

    );
  }
}

export default App;