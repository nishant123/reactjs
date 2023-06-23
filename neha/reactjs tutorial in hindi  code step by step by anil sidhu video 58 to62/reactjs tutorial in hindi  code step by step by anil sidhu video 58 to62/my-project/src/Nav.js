import  React from 'react'
import {Link}from 'react-router-dom'

function Nav()
{
    return(
        <div>
            <Link to="/">Home page</Link>
        <br/><br/>
        <Link to="/about">About page</Link>
        </div>
    )
}

export default Nav;