import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import login from "./components/Login";
import homepage from "./components/Home";
import recomendacao from "./components/Recomendacao";


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={login}/>
      <Route path="/home"  component={homepage}/>
      <Route path="/recomendacao" component={recomendacao}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);