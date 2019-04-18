import React from "react"

interface IProps{
    error: object
}

 const Error: React.FunctionComponent<IProps> =({error}) => (<h1> Error</h1>)


 export default Error; 