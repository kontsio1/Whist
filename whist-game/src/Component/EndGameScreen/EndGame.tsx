import {Box, Button, Text} from "@chakra-ui/react";
import {Link} from "react-router-dom";

export const EndGame =()=>{
    return (
        <Box className={'pageSection'} textAlign={'center'}>
            <header>Winner:</header>
            <Text fontSize={{base: 'lg', md: 'xl'}}>you for sure</Text>
            <div className={"endGameButtonsContainers"}>
                <Link to={'/setup'}><Button variant={'custom'} w={{base: '100%', md: 'auto'}}>Play Again!</Button></Link>
                <Link to={'/stats'}><Button variant={'main'} w={{base: '100%', md: 'auto'}}>Tryhard stuff</Button></Link>
            </div>
        </Box>
    )
}