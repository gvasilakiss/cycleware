import React, { Component } from 'react';
import firebase from '../Firebase';
import { Link } from 'react-router-dom';

class Show extends Component {

  constructor(props) {
    super(props);
    this.state = {
      video: {},
      key: ''
    };
  }

  componentDidMount() {
    console.log(this.props.match.params.id)
    const ref = firebase.firestore().collection('videos').doc(this.props.match.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          video: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  delete(id) {
    firebase.firestore().collection('videos').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
      this.props.history.push("/")
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  render() {
    return (

      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4><Link to="/">Issue List</Link></h4>
            <h3 className="panel-title">
              {this.state.video.title}
            </h3>
          </div>
          <div className="panel-body">
            <dl>
              <dt>Description:</dt>
              <dd>{this.state.video.description}</dd>
              <dt>url:</dt>
              <dd>{this.state.video.url}</dd>
            </dl>
            <Link to={`/edit/${this.state.key}`} className="btn btn-success">Edit</Link>&nbsp;
            <button onClick={this.delete.bind(this, this.state.key)} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>

    );
  }
}

export default Show;