import React from "react";
import {AppDrawer} from "./AppDrawer";
import {Link} from "react-router-dom";
import {Button} from "@chakra-ui/react";
import {TwoCircles} from "../Utils/twoCircles";
export const Home = () => {
    return (
        <div>
            <header>Welcome to Whiiist</header>
            <AppDrawer/>
            <body>
            <img src={'test.svg'}/>
            <TwoCircles calls={9} tricks={2}/>
            <Link to={'/setup'}>
                <Button size='lg'>Start new game</Button>
            </Link>
            </body>
        </div>
    )
}
