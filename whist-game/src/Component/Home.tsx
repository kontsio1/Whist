import React, {useState} from "react";
import {AppDrawer} from "./AppDrawer";
import {Link} from "react-router-dom";
import {Box, Button} from "@chakra-ui/react";
import {ScoreBubbles} from "../Utils/ScoreBubbles";

export const Home = () => {
    const zoomStyle = {
        padding: '50px',
        backgroundColor: 'green',
        transition: 'transform 0.2s',
        width: '200px',
        height: '200px',
        margin: '0 auto',
        ':hover': {
            transform: 'scale(1.2)'
        }
    };
    
    return (
        <div>
            <header>Welcome to Whiiist</header>
            <AppDrawer/>
            <body>
            <ScoreBubbles score={238} tricks={8} calls={4} />
            <Box sx={{...zoomStyle, ':hover': {transform: 'scale(1.2)'}}}><p>hello there bro</p></Box>
            <Link to={'/setup'}>
                <Button size='lg'>Start new game</Button>
            </Link>
            </body>
        </div>
    )
}
