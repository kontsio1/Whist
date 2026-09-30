import React from "react";
import {AppDrawer} from "./AppDrawer";
import {Link} from "react-router-dom";
import {Box, Button, Center, Stack, Text} from "@chakra-ui/react";

export const Home = () => {
    return (
        <Box className={'pageSection'}>
            <AppDrawer/>
            <Stack spacing={{base: 6, md: 8}} align={'center'} textAlign={'center'}>
                <header>Welcome to Whiiist</header>
                <Text maxW={'2xl'} className={'helperText'}>
                    Keep score for your Whist games with a layout that now scales much better on phones and tablets.
                </Text>
                <Center className={"startButtonPosition"} w={'100%'}>
                    <Box w={'100%'} maxW={'24rem'}>
                        <Link to={'/setup'}>
                            <Button variant={'custom'} className={"bigCustomButton"} size='lg'>
                                Start new game
                            </Button>
                        </Link>
                    </Box>
                </Center>
            </Stack>
        </Box>
    )
}
