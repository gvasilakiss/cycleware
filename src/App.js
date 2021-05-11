//You may notice that some things are not used.. 
//Consider cleaning up the project and adding comments

import React, { Component } from 'react';

import './App.css';
import firebase from './Firebase';
import Thumbnail from './components/Thumbnail';

import {
  Switch,
  Route,
  Link
} from "react-router-dom";



class App extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('users');
    this.unsubscribe = null;
    this.state = {
      videos: []
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const videos = [];
    querySnapshot.forEach((doc) => {
      const { title, description, url } = doc.data();
      videos.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        url,
      });
    });
    this.setState({
      videos
    });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    return (

      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              Videos
            </h3>
          </div>
          <div className="panel-body">
            <h4><Link to="/create" className="btn btn-primary">Add Video</Link></h4>
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {this.state.videos.map(video =>
                  <tr key={video.key}>
                    <td><Link to={`/show/${video.key}`}><Thumbnail img={video.url} /></Link></td>
                    <td><Link to={`/show/${video.key}`}>{video.title}</Link></td>
                    <td>{video.description}</td>
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

export default App;