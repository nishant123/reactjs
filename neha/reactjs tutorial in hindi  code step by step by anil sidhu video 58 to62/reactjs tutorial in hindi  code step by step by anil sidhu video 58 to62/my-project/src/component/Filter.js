import { useSearchParams } from "react-router-dom"

function Filter()
{
    const [searchParams,setSearchParams]=useSearchParams();
    console.warn(searchParams.get('age'))
    console.warn(searchParams.get('city'))
    const age=searchParams.get('age');
    const city=searchParams.get('city');
    return(
        <div>
            <h1>Filter page</h1>
            <h3>age is:{age}</h3>
            <h3>city is:{city}</h3>

            <input type="text" onclick={(e)=>setSearchParams({text:e.target.value})} placeholder="set query in text Params"/>

            <button onclick={()=>setSearchParams({age:40})}>set age inquery params</button>
        </div>
    )
}
export default Filter; 