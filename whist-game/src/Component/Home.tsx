import React from "react";
import {AppDrawer} from "./AppDrawer";
import {Link} from "react-router-dom";
import {Button, Center} from "@chakra-ui/react";
export const Home = () => {
    return (
        <>
            <header>Welcome to Whiiist</header>
            <body>
            <AppDrawer/>
            <Center className={"startButtonPosition"}>
                <Link to={'/setup'}>
                    <Button variant={'custom'} className={"bigCustomButton"} size='lg'>Start new game</Button>
                </Link>
            </Center>
            </body>
        </>
    )
}
