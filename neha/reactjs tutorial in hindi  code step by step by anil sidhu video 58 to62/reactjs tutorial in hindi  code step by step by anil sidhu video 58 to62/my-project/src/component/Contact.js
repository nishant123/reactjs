import {Link,Outlet} from "react-router-dom";


function Contact() 
{
    return (
        <div>
            <h1>Contact  Us page</h1>
            <h2>Here we   have some other business</h2>
            <Link to="company">Company</Link>
            <Link to="channel">Channel</Link>
            <Link to="other">Other</Link>
            
            <Outlet/>
            <Outlet/>
            <Outlet/>


        </div>
    )
}
export default Contact; 