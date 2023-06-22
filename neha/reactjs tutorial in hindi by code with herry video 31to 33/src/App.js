
import './App.css';

import React, { Component } from 'react'
import react, { useState } from 'react'
import NavBar from './components/NavBar';
import News from './components/News';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


export default class App extends Component {
  pageSize = 5;

  render() {
    return (
      <div>
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/general"><About /><News key="general" pageSize={5} country="in" category="general" /></Route>
            <Route exact path="/business"><About /> <News key="business" pageSize={5} country="in" category="business" /></Route>
            <Route exact path="/entertainment"><About /> <News key="entertainment" pageSize={5} country="in" category="entertainment" /></Route>
            <Route exact path="/health"><About /> <News key="health" pageSize={5} country="in" category="health" /></Route>
            <Route exact path="/sports"><About /> <News key="sports" pageSize={5} country="in" category="sports" /></Route>
            <Route exact path="/technology"><About /> <News key="technology" pageSize={5} country="in" category="technology" /></Route>

          </Switch>
        </Router>
      </div>
    )
  }
}

