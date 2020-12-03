import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import login from "./components/Login";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={login}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);