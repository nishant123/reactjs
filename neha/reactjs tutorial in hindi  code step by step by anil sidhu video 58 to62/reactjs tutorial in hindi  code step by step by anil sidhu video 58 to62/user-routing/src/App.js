import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Link,Route} from 'react-router-dom';
import User from './User';

function App() {
  let users=[
    {id:1,name:'peter',email:'peter@test.com'},
    {id:2,name:'bruce',email:'bruce@test.com'},
    {id:3,name:'sam',email:'sam@test.com'},
    {id:4,name:'tony',email:'tony@test.com'},
    {id:5,name:'anil',email:'anil@test.com'},
  ]
  return (
    <div className="App">
      <Router>
      <h1>React Dynamic Routing</h1>
      {
        users.map((item)=>
        <div><Link to={"/users"+item.id}><h3>{item.name}</h3></Link></div>)
      }
      <Route path="/user/:id"><User/></Route>
      </Router>
    </div>
  );
}

export default App;
