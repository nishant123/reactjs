
import './App.css';

import react, { useState } from 'react'
import NavBar from './components/NavBar';
import News from './components/News';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'

const App = () => {

  const pageSize = 5;
  const apikey = process.env.REACT_APP_NEWS_API

  const [progress, setProgress] = useState(0)



  return (
    <div>
      <Router>
        <NavBar />
        <LoadingBar
          color='#f11946'
          progress={progress}
        />
        <Switch>
          <Route exact path="/general"><About /><News setProgress={setProgress} apikey={apikey} key="general" pageSize={page.Size} country="in" category="general" /></Route>
          <Route exact path="/business"><About /> <News setProgress=
            {setProgress} apikey={apikey} key="business" pageSize={page.Size} country="in" category="business" /></Route>
          <Route exact path="/entertainment"><About /> <News setProgress={setProgress} apikey={apikey} key="entertainment" pageSize={page.Size} country="in" category="entertainment" /></Route>
          <Route exact path="/health"><About /> <News setProgress={setProgress} apikey={apikey} key="health" pageSize={page.Size} country="in" category="health" /></Route>
          <Route exact path="/sports"><About /> <News setProgress={setProgress} apikey={apikey} key="sports" pageSize={page.Size} country="in" category="sports" /></Route>
          <Route exact path="/technology"><About /> <News setProgress={setProgress} apikey={apikey} key="technology" pageSize={page.Size} country="in" category="technology" /></Route>

        </Switch>
      </Router>
    </div>
  )

}
export default App;
