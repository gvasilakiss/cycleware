import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Switch } from "react-router-dom";

import Create from "./components/Create";
import Edit from "./components/Edit";
import Show from "./components/Show";

import { Route } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      { /* Route components are rendered if the path prop matches the current URL */}
      <Route exact path="/" render={(props) => <Create {...props} />} />
      <Route exact path="/show/:id" render={(props) => <Show {...props} />} />
      <Route exact path="/edit/:id" render={(props) => <Edit {...props} />} />
      <Route exact path="/create" render={(props) => <Create {...props} />} />
      <Route exact path="/admin" render={(props) => <App {...props} />} />
    </Switch>
  </BrowserRouter>
  ,
  document.getElementById('root')
);
