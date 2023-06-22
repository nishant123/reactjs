
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
import LoadingBar from 'react-top-loading-bar'

export default class App extends Component {

  pageSize = 5;
  state = {
    progress: 0
  }
  setProgress = (progress) => {
    this.setState({ progress: progress })
  }

  render() {
    return (
      <div>
        <Router>
          <NavBar />
          <LoadingBar
            color='#f11946'
            progress={this.state.progress}
          />
          <Switch>
            <Route exact path="/general"><About /><News setProgress={this.setProgress} apikey={apikey} key="general" pageSize={this.page.Size} country="in" category="general" /></Route>
            <Route exact path="/business"><About /> <News setProgress=
              {this.setProgress} apikey={apikey} key="business" pageSize={this.page.Size} country="in" category="business" /></Route>
            <Route exact path="/entertainment"><About /> <News setProgress={this.setProgress} apikey={apikey} key="entertainment" pageSize={this.page.Size} country="in" category="entertainment" /></Route>
            <Route exact path="/health"><About /> <News setProgress={this.setProgress} apikey={apikey} key="health" pageSize={this.page.Size} country="in" category="health" /></Route>
            <Route exact path="/sports"><About /> <News setProgress={this.setProgress} apikey={apikey} key="sports" pageSize={this.page.Size} country="in" category="sports" /></Route>
            <Route exact path="/technology"><About /> <News setProgress={this.setProgress} apikey={apikey} key="technology" pageSize={this.page.Size} country="in" category="technology" /></Route>

          </Switch>
        </Router>
      </div>
    )
  }
}

