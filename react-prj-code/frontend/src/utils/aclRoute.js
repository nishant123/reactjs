import React from 'react'
import { Route, Redirect, } from 'react-router-dom'
import permissionCheck from './permissionCheck'

// create not authorised page//
const AclRoute = ({ render, path, entity, action }) => {
  return (
    <Route exact path={path} render={(props) => 
          (
            permissionCheck( entity, action) === true ?render({ ...props }) :
           <Redirect to={"/unauthorised"} />
           )
          }/>
)
}
export default AclRoute
