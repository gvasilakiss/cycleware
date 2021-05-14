import React from "react";
import firebase from "./Firebase";
import swal from 'sweetalert';

class Login extends React.Component {

    login() {
        //create provider object
        let provider = new firebase.auth.GoogleAuthProvider();
        // Open popup and login students
        console.log('Called function GoogleLogin 🚀');
        firebase.auth().signInWithPopup(provider).then(res => {
            console.log("logged in as: " + res.user.email);
            let user = res.user;
            swal({
                title: "Successful Login!",
                text: "Welcome, " + user.displayName,
                icon: "success",
                timer: 1500,
                button: false
            });

            // Get user details
            if (user) {

            }
        }).catch(e => {
            console.log("Error: " + e);
        });
    }
    render() {
        return (
            <div id="vertical-center" className="grid">
                <button type="button" className="btn btn-primary" onClick={this.login}>Log In</button>
            </div>
        )
    }
}

export default Login;