import logo from './logo.svg';
import './App.css';
import React, { useRef, useState } from 'react';
import {BrowserRouter as Router,Route, Link } from 'react-router-dom';
// import Home from './component/Home';
// import About from './component/About';
import Navbar from './component/Navbar';
// import User from './component/User';
import Filter from './component/Filter';
import Contact from './component/Contact';
import Company from './component/Company';
import Channel from './component/Channel';
import Other from './component/Other';
import Login from './component/Login';
import User from './User';
// import Protected from './component/Protected';
// import Nav from './Nav';
// import Home from './Home';
// import About from './About';

// import React,{useRef} from 'react';
// import User from './User';
// import { render } from '@testing-library/react';
// import { useState } from 'react';
// class App extends React.Component{
// constructor()
// // {
// //   super();
// //   this.inputRef=createRef();
// // }

function App() {
  //   const [count, setCount] = useState(0);
  //   const [item, setItem] = useState(10);

  //  function multiCount()
  //  {
  //   return count*5
  //  }
  // componentDidMount() 
  // {
  //   // console.warn(this.inputRef.current.value="1000")
  // }
  // getval()
  // {
  //   console.warn(this.inputRef.current.value)
  //   this.inputRef.current.style.color="green"
  //   this.inputRef.current.style.background="yellow"
  // }
  // render()
  // {
  //   let inputRef=useRef(null)
  // function handleInput()
  // {
  //   console.warn("function call")
  //   inputRef.current.value="1000"
  //   inputRef.current.focus();
  // }
  // let inputRef =useRef(null);
  //   function updateInput()
  //   {
  //     inputRef.current.value="1000"
  //   }
  // let[val,setVal]=useState("")
  // let[item,setItem]=useState("")
  // let inputRef=useRef(null)
  // let inputRef2=useRef(null)
  // function submitForm(e)
  // {
  //   e.preventDefault()
  //   console.warn("input field 1 value :",inputRef.current.value)
  //   console.warn("input field 2 value :",inputRef2.current.value)
  // }

let users=[
  {id:1, name:'anil',email:'anil@test.com'},
  {id:2, name:'sam', email:'sam@test.com'},
  {id:3, name:'peter',email:'peter@test.com'},
  {id:4, name:'bruce',email:'bruce@test.com'},
  {id:5, name:'tony',email:'tony@test.com'},
]


  return (
    <div className="App">
      {/* <h1>Usememo Hook in react js</h1>
      <h2>Count:{count}</h2>
      <h2>Item:{item}</h2>
      <h2>{multiCount()}</h2>
      <button onClick={() => setCount(count + 1)}>Update Count</button>

      <button onClick={() => setItem(item * 10)}>Update Item</button> */}
      {/* <h1>REf in REACT</h1> */}
      {/* <input type="text" ref={this.inputRef}/> */}
      {/* <button onClick={()=>this.getval()}>Check Ref</button> */}
      {/* <h1>useRef IN REACT</h1>
      <input type="text" ref={inputRef}/>
      <button onClick={handleInput}>Handle Input</button> */}
      {/* <h1>ForwardRef in react js</h1> */}
      {/* <User ref={inputRef}/>
  <button onClick={updateInput}>Update InputBox</button> */}

      {/* <input type="text" value={val} onChange={(e)=>setVal(e.target.value)}/>
    <input type="text" value={item} onChange={(e)=>setItem(e.target.value)}/> */}
      {/* <h1>uncontrolled Component</h1>
      <form onSubmit={submitForm}>
        <input ref={inputRef} type="text" /><br /><br />
        <input ref={inputRef2} type="text" /><br /><br />
        <button>Submit</button>
      </form> */}
      {/* <h1>HOC</h1>
      <HOCRed cmp={Counter}/>
      <HOCGreen cmp={Counter}/> */}
      {/* <BrowserRouter>
   <Navbar/>
   <Routes>
   <Route path="/" element={<Protected Component={Home}/>} />
   <Route path="/login" element={<Login/>} />
   <Route path="/about" element={<Protected Component={About}/>} />
   <Route path="user" element={<Protected Component={User}/>}/>
   <Route path="filter" element={<Protected Component={Filter}/>}/>
   <Route path="/contact/" element={<Contact/>}/>
      <Route path="company"element={<Protected Component={Company}/>}/>
      <Route path="channel"element={<Protected Component={Channel}/>}/>
      <Route path="other"element={<Protected Component={Other}/>}/>
   </Routes>
   
   </BrowserRouter> */}
      {/* <h1>Routing Setup</h1> */}
        {/* <Nav />
        
        <Route path="/about"><About /></Route>
        <Route path="/" exact={true}><Home /></Route> */}
        <Router>
        <h1>React Dynamic routing</h1>
        {
          users.map((item)=>
          <div>
            <Link to={"/users/"+item.id}><h3>{item.name}</h3></Link>
            </div>)
        }
        <Route path="/user/:name"><User/></Route>
        </Router>
    </div>
  );
}




// function HOCRed(props)
// {
//   return <h2 style={{backgroundColor:'red',hight:100,width:100}}>red<props.cmp/></h2>
// }
// function HOCGreen(props)
// {
//   return <h2 style={{backgroundColor:'green',hight:100,width:100}}>Green<props.cmp/></h2>
// }
// function Counter()
// {
//   const[count,setCount]=useState(0)
//   return<div>
//     <h3>{count}</h3>
//     <button onClick={()=>setCount(count+1)}>Update</button>
//   </div>
// }

// }


export default App;
