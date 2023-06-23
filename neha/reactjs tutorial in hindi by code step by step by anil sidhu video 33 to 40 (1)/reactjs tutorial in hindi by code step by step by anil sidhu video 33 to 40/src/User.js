function User(props)
{
    const data="Anil Sidhu"
    return(
        <div>
            <h2>User name: </h2>
            <button onClick={()=>props.alert(data)}> Click me</button>
        </div>
    )
}
export default User;
