import logo from './logo.svg';
import './App.css';
import './style.css'
import {Button}from 'react-bootstrap';
import {Table} from 'react-bootstrap'
import style from  './custom.module.css'
import React from 'react';
import Users from './Users'
 import Cols from './Cols';
import User from './User';
function App() {
// const students=['Anil','Sidhu','sam','peter'];
// const users=[
//   {
//     name:'anil',email:'anil@test.com',address:'noida'},
//   {
//     name:'sam',email:'sam@test.com',address:'jaipur'},
//   {
//     name:'peter',email:'peter@test.com',address:'delhi'},
//   {
//     name:'mohan',email:'mohan@test.com',address:'karnatka'}
// ]
//map looping
// students.map((item)=>{
// console.warn("my name is",item)
// });
// for(let i=0;i<students.length;i++)
// {
//   console.warn("in for loop:",students[i])
// }
function parentAlert(data)
{
alert(data);
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
    {/* <h1>  list item with bootstrap table</h1> */}
    {/* <Table striped bordered hover variant='dark'>
      <tbody>
    <tr>
        <td>Name</td>
        <td>Email</td>
        <td>Contact</td>
      </tr>
    </tbody>
  {
     
      users.map((item)=>
      <Table striped bordered hover variant='dark'>
      <tbody> 
      <tr>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{
          item.address.map((data)=> 
          <tr>
        <td>{data.hn}</td>
        <td>{data.city}</td>
        <td>{data.country}</td>
        </tr>
          )
        }
        </td>
        </tr>
        </tbody>
      </Table>
   )}
   
    </Table> */}
   
  <h1>Lifting State up</h1>
  <User alert={parentAlert}/>
  
  {/* {
    users.map((item,i)=>
    <Users data={item}/>
    )
  } */}
    </div>
  );
}

export default App;
