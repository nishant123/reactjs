function Users(props)
{
    return(
        <div>
        <span>{props.data.name}</span>
        <span>{props.data.email}</span>
        <span>{props.data.address}</span>
        </div>
    )
}
export default Users;