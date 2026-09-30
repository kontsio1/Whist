import {user} from "../../Constants";
import {Avatar, Badge, Box, Center, Heading, SimpleGrid, Spinner, Stack, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api";

export const Stats = () => {
    const [players, setPlayers] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const getPlayerAsync = async () => {
            setLoading(true)
            const users = await getPlayersNames()
            const names = users.map(u => u.username)
            setPlayers(names)
            setLoading(false)
        }
        getPlayerAsync().catch(console.error)
    }, []);
    const getPlayersNames = async (): Promise<user[]> => {
        try {
            const resp = await api.get("/users");
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const HandleBadgeClick = (player: string) => {
        navigate(`/stats/${player}`)
    }
    return <Box className={'pageSection'}>
        <Heading textAlign={'center'}>Stats</Heading>
        <Stack spacing={3} maxW={'3xl'}>
            <Text>Welcome to the -not that nerdy- stats page!</Text>
            <Text>
                Here you can view general information about the game and about individual performances as well as sneaky
                rivalries and maybe find your biggest weakness. Tap a player to dig in.
            </Text>
        </Stack>
        {loading ? (
            <Center py={8}>
                <Spinner thickness='5px' speed='0.65s' emptyColor='brand.200' color='brand.100' size='xl'/>
            </Center>
        ) : (
            <SimpleGrid minChildWidth={{base: '9rem', md: '10rem'}} spacing={4}>
                {players.map((player: string, index: number) => {
                    return (
                        <Box
                            key={`${player}-${index}`}
                            onClick={() => HandleBadgeClick(player)}
                            cursor={'pointer'}
                            bg={'teal'}
                            p={4}
                            color={'white'}
                            minH={'170px'}
                            borderRadius={20}
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            gap={3}
                            className={'statsCard'}
                        >
                            <Badge borderRadius='full' px='2' colorScheme='teal'>{`Player ${index + 1}`}</Badge>
                            <Text textAlign={'center'} fontWeight={'semibold'} noOfLines={2}>{player}</Text>
                            <Avatar bg='teal.500'/>
                        </Box>
                    )
                })}
            </SimpleGrid>
        )}
    </Box>
}