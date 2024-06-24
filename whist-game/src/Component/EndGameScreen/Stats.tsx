import {statsGetRequest, user} from "../../Constants";
import axios from "axios";
import {Avatar, Badge, Box, Button, GridItem, Heading, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../../api";

export const Stats = () => {
    const [players, setPlayers] = useState<string[]>([])
    const navigate = useNavigate()
    
    useEffect(() => {
        getPlayersNames().then((users)=>{
            const names = users.map(u => u.username)
            setPlayers(names)
        })
    }, []);
    const getPlayerStats = async (): Promise<statsGetRequest> => {
        try {
            const resp = await api.get("/stats/player1");
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const getPlayersNames = async (): Promise<user[]> => {
        try {
            const resp = await api.get("/users");
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const HandleBadgeClick = (player:string) => {
        navigate(`/stats/${player}`)
    }
    return <div>
        <Heading>Stats</Heading>
        <Box maxW={900}>
            <p>Welcome to the -not that nerdy- stats page!</p>
            <p>Here you can view general information about the game and about individual performances as well as sneaky rivalries and maaaaybe find your biggest weakness... Click on a player to see</p>
        </Box>
        {players.map((player, index) => {
            return (
                    <Box onClick={()=> HandleBadgeClick(player)} style={{display: "inline-block", margin:10, cursor: "pointer"}} bg={'teal'} p={4} color={'white'} height={170} maxW={100} borderRadius={20}>
                        <Badge borderRadius='full' px='2' colorScheme='teal'>{`Player ${index}`}</Badge>
                        <p>{player}</p>
                        <Avatar bg='teal.500'/>
                    </Box>
            )
        })}
    </div>
}