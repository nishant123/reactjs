import logo from './logo.svg';
import './App.css';
import './style.css'
import {Button}from 'react-bootstrap';
import style from  './custom.module.css'
import React from 'react';
function App() {
const students=['Anil','Sidhu','sam','peter'];
//map looping
students.map((item)=>{
console.warn("my name is",item)
});
for(let i=0;i<students.length;i++)
{
  console.warn("in for loop:",students[i])
}
  return (
    <div className="App">
      {/* <h1 className='primary'>Style type 1 in react js</h1>
      <h1 style={{color:'red',backgroundColor:'black'}}>Style type 2 in react js</h1>
      <h1 className={style.success}>Style type 3 in react js</h1> */}
      {/* <h1>Install Bootstrap</h1> */}
      {/* <Button onClick={()=>alert("Hello")}>Click me</Button>
      <Button variant="primary">Primary</Button>{' '}
      <Button variant="secondary">Secondary</Button>{' '}
      <Button variant="success">Success</Button>{' '}
      <Button variant="warning">Warning</Button>{' '}
      <Button variant="danger">Danger</Button>{' '}
      <Button variant="info">Info</Button>{' '}
      <Button variant="light">Light</Button>{' '}
      <Button variant="dark">Dark</Button> <Button variant="link">Link</Button> */}
    <h1>Handle array with list</h1>
    </div>
  );
}

export default App;
