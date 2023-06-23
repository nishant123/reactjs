
import { useState } from 'react'
function Profile() {
    const [loggedIn, setLoggedIn] = useState(1)

    //1,2,3
        return (
            <div>
              {loggedIn==1? <h1>Welcome  Anil</h1>:loggedIn==2?<h1>Welcome guest</h1>:<h1>Welcome user1</h1>}
            </div>
        )
              
}

export default Profile;