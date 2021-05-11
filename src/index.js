import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";

import Create from "./components/Create";
import Edit from "./components/Edit";
import Show from "./components/Show";

import { Switch, Route, Link } from "react-router-dom";

ReactDOM.render(

  <BrowserRouter>
    { /* Route components are rendered if the path prop matches the current URL */}
    <Route exact path="/" render={(props) => <App {...props} />} />
    <Route exact path="/show/:id" render={(props) => <Show {...props} />} />
    <Route exact path="/edit/:id" render={(props) => <Edit {...props} />} />
    <Route exact path="/create"><Create /></Route>
    <Route exact path="/admin"><App /></Route>
  </BrowserRouter>
  ,
  document.getElementById('root')
);
