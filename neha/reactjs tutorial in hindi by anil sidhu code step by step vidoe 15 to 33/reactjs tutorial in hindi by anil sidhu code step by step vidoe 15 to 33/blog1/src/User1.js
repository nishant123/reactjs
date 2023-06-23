import React from "react";
class User1 extends React.Component{


    render()
    {   
        console.warn("Render method",this.props)
        return(
            <div>
                <h1>User Component</h1>
            </div>
        )
    }
}
export default User1;