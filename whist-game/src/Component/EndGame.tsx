import {Button} from "@chakra-ui/react";
import {Link} from "react-router-dom";

export const EndGame =()=>{
    return (
        <div>
            <header>Winner:</header>
            <p>you for sure</p>
            <Link to={'/setup'}><Button variant={'main'}>Play Again!</Button></Link>
            <Link to={'/stats'}><Button variant={'main'}>Tryhard stuff</Button></Link>
        </div>
    )
}