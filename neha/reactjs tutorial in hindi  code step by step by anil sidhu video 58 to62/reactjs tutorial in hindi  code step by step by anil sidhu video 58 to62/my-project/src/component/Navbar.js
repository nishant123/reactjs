import {NavLink}from 'react-router-dom'
function Navbar()
{
    return(<div>
<ul className="navbar">
    <li> <NavLink className="nav-bar-link" to="/">Home</NavLink></li>
    <li><NavLink className="nav-bar-link" to="/about">About</NavLink><br/></li>
    <li><NavLink className="nav-bar-link" to="/user/anil">Anil</NavLink><br/></li>
    <li><NavLink className="nav-bar-link" to="/filter">Filter</NavLink><br/></li>
    <li><NavLink className="nav-bar-link" to="/contact">Contact</NavLink><br/></li>
    <li><NavLink className="nav-bar-link" to="/login">Login</NavLink><br/></li>
    
</ul>
    </div>)

}
export default Navbar;