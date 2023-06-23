// import React,{forwardRef} from "react"
// function User(props,ref)
// {
//     return(
//         <div>
//             <input type="text" ref={ref}/>
//         </div>
    
//     )
// }
// export default forwardRef(User) ;

import{withRoute} from 'react-router-dom'
function User(prop)
{
    console.warn(prop)
    return(
        <div>
            <h1>User Component</h1>
        </div>
    )
}
export default User;