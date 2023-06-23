import React from "react";
function Users(props)
{
    return(
        <div>
            <h1>Users Component</h1>
            <button onClick={props.data}>Call data function</button>
        </div>
    )
}
export default Users;