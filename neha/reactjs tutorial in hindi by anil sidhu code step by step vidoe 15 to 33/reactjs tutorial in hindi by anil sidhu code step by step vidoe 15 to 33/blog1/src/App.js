// import {useState} from 'react';
import logo from './logo.svg';
import './App.css';
// import React,{useEffect, useState} from 'react';
import User2 from './User2';
import React,{useEffect,useState} from 'react';

// class Student extends React.Component{
  
//   render()
//   {
    
//     return(
//       <div className='App'>
//         <h1>Student  Component</h1>
        
//         </div> 
//     )
//   }
// }
// import User1 from './User1';
// import Users from './Users';
// import Members from './Members';
// import Login from './Login';
// import Profile from './Profile';
// import React,{useState} from 'react'

// import Student from './Student';
//  import User from './User'

function App() {
// let data="anil sidhu";
//   function apple()
//   {
//     data="peter";
//     alert(data);
//   }
// let data="anil";
// function updateData()
// {
//   data="sidhu";
//   alert(data);
// }
// const [data,setData]=useState("anil")
// function updateData()
// {
//   setData("sidhu")
// }
// console.warn("______");

// const [data,setData]=useState(null)
// const [print,setPrint]=useState(false)
// function getData(val)
// {
//   console.warn(val.target.value)
// setData(val.target.value)
// setPrint(false)
// }  
// const [status,setStatus]=React.useState(true)
// const [name,setName]=useState("");
// const [tnc,setTnc]=useState(false);
// const [Interest,setInterest]=useState("");
//   function getFormData(e)
//   {
//     console.warn(name,tnc,Interest)
//     e.preventDefault()
//   }
// function getData()
// {
//   alert("Hello from app")
// }
// const[name,setName]=React.useState("Anil")
// const[data,setData]=useState("Anil")

// const[count,setCount]=useState(0)
// useEffect(()=>{
//   console.warn("useeffect")
// })
const[data,setData]=useState(10);
const[count,setCount]=useState(100);

useEffect(()=>{
  console.warn("called with data state")
},[data])

useEffect(()=>{
  console.warn("called with count state")
},[count])
return (
    <div className="App">
      {/* <h1>Props in React :</h1> */}
     {/* <h1>{data}</h1>  
     <User/> */}
     {/* <button onClick={apple} >Click Me</button> */}
      {/* <button onClick={updateData}>Update data</button> */} 
    {/* <Student name="Anil" email="anil@test.com"></Student> */}
   {/* <button>Update Name</button> */}
{/* {
  status?
 <h1>Hello WORLD</h1>
  :null
} */}
  {/* <input type="text" onChange={getData}/>
  <button onClick={()=>setPrint(true)}>Print Data</button> */}
  
  {/* <button onClick={()=>setStatus(false)}>Hide</button>
  <button onClick={()=>setStatus(true)}>Show</button> */}
{/* <button onClick={()=>setStatus(!status)}>Toggle</button> */}

{/* <h1>Handle form in react!</h1> */}
  {/* <form onSubmit={getFormData}>
  <input type="text" placeholder="Enter name" onChange={(e)=>setName(e.target.value)}/><br/><br/>
  <select onChange={(e)=>setInterest(e.target.value)}>
    <option>Select option</option>
    <option>Marvel</option>
    <option>DC</option>
  </select>
<br/><br/>
<input type="checkbox" onChange={(e)=>setTnc(e.target.checked)}/><span>Accept term and condition</span>
<br/><br/>
<button type="submit">Submit</button>
  </form> */}

{/* <Profile/> */}
{/* <Login/> */}
{/* {/* <Users data={getData}/>
<Users data={getData}/>
<Users data={getData}/> 
<Users data={getData}/>
    <div style={{float:'right'}}>
    <Members data={getData}/> 
    </div> */}
{/* <h1>Render method in react</h1> */}
{/* <User1 name={name}/>
<button onClick={()=>setName("sidhu")}>Update Name</button> */}
    {/* <h1>useEffect in React</h1>
    <button>Update counter</button> */}
    <h1>Count : {count}</h1>
    <h1>Data : {data}</h1>
<button onClick={()=>setCount(count+1)}>Update count</button>
<button onClick={()=>setData(data+1)}>Update Data</button>
    </div>
  );
}


export default App;
