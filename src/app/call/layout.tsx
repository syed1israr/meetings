interface props{
    children:React.ReactNode;
}


const layout = ({children} : props ) =>{
    return(
        <div className="h-screen bg-black">
            { children }
        </div>
    )
}

export default layout;