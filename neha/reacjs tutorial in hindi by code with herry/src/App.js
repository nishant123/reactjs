//import logo from './logo.svg';
import './App.css';
//import TextForm from './components/TextForm';
import Navbar from './components/Navbar';
import React, { useState } from 'react';

function App() {
  const [Mode, setMode] = usestate('light');//whether darkmode is enabled or not
  return (
    const toggleMode = () => {
      if (Mode === 'light ') {
        setMode = ('dark');
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

    < Navbar title = "TextUtils" Mode = { Mode } toggleMode = { toggleMode } />
      <div className="container my-3"></div>
      <About />
    </>
  );
}

export default App;
