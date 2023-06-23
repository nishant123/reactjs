import {Link,useNavigate}from 'react-router-dom'

function Home()
{
    
    const navigate=useNavigate();
    const navToPage=()=>{
        let x=false;
        if(x){
        navigate('/about')
    }else{
        navigate('/Filter')
    }
    }
    return(<div>
    <h1>Home Page</h1>
     <p>this home page to safagadgedhsdhsdavasda</p>
    <p>sADSAGHTJJGFNVCxZCCXVCBVNBVMNMGHJGHSGS S FadA </p>
<Link to="/about" >Goto  about page</Link>
    <br/>
<button onClick={()=>navToPage('/about')}>Go to about page</button>
<br/>
<button onClick={()=>navToPage('/filter')}>Go to Filter page</button>
    </div>
    )
}
export default Home;