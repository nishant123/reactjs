// import {useState} from 'react';
import logo from './logo.svg';
import './App.css';
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
function getData(val)
{
  console.warn(val.target.value)
}  
return (
    <div className="App">
      {/* <h1>Props in React :</h1> */}
     {/* <h1>{data}</h1> 
     <User/> */}
     {/* <button onClick={apple} >Click Me</button> */}
      {/* <button onClick={updateData}>Update data</button> */} 
    {/* <Student name="Anil" email="anil@test.com"></Student> */}
   {/* <button>Update Name</button> */}
  <h1>Get input box value!</h1>
  <input type="text" onChange={getData}/>
    </div>
  );
}


export default App;
