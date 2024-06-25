import React from "react";
import {AppDrawer} from "./AppDrawer";
import {Link} from "react-router-dom";
import {Button} from "@chakra-ui/react";
export const Home = () => {
    return (
        <>
            <header>Welcome to Whiiist</header>
            <AppDrawer/>
            <body>
                <Link to={'/setup'}>
                    <Button size='lg'>Start new game</Button>
                </Link>
            </body>
        </>
    )
}
