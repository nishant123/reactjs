//import logo from './logo.svg';
import './App.css';
import TextForm from './components/TextForm';
import Navbar from './components/Navbar';
import React, { useState } from 'react';

import About from './components/About';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
function App() {
  // const [Mode, setMode] = usestate('light');//whether darkmode is enabled or not
  return (

const removeBodyClasses() => {

    document.body.classList.remove('bg-light')
    document.body.classList.remove('bg-drak')
    document.body.classList.remove('bg-warning')
    document.body.classList.remove('bg-danger')
    document.body.classList.remove('bg-success')

  }

  const toggleMode = (cls) => {
    console.log(cls)
    document.body.classList.add('bg' + cls)
    if (Mode === 'light ') {
      setMode = ('dark');
      document.body.style.backgourndColor = '#042743';
      showalert("dark mode has been enabled", "success");
    }
    else {
      setMode = ('light');
    }


  }
  <>
    {/*<div className="container">
        <h1>{props.heading}</h1>
        <div className="mb-3"></div>
        <TextForm heading="Enter the text to analyze" />
      </div>
      <div className="container my-3">
        <h1>your text summary</h1>
        <p>{text.split(" ").length} and {text.length}character</p>
  </div>*/}
    <router>
      < Navbar title="reactjs" Mode={Mode} toggleMode={toggleMode} />
      <alert alert={alert} />
      <div className="container my-3">
        <switch>
          <Route exact path="/about">
            <About />
          </Route>

          <Route exact path="/">
            <TextForm showalert={showalert} heading="Try TextUtils -word counter,Character counter, Remove extra spaces" mode={mode} />


          </Route>
        </switch>
      </div>
    </router>


  </>
  );
}

export default App;
