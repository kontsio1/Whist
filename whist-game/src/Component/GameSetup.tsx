import {
    Avatar,
    Badge,
    Box, Button, Grid, GridItem,
    Heading,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {PlusSquareIcon} from "@chakra-ui/icons";
import {AddPlayerModal, PlayerCard} from "./AddPlayerModal";
import React, {MouseEventHandler, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {user} from "../Constants";

export const GameSetup = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()
    const [playerBoxes, setPlayerBoxes] = useState<PlayerCard[]>([])
    const [disabled, setDisabled] = useState<boolean>(true)
    const [newPlayer, setNewPlayer] = useState<PlayerCard>()
    const navigate = useNavigate();
    const convertStateToRequestBody = (playerCards : PlayerCard[]): user[] => {
        return playerCards.map((card)=>{
            return {
                username: card.username
            }
        })
    }
    const handleChange = (e: any)=>{
        if(e.target.value){
            setDisabled(false)
            setNewPlayer(new PlayerCard(e.target.value))
        }
    }
    const onCloseModal = () => {
        onClose()
        setNewPlayer(undefined)
        setDisabled(true)
    }
    const addPlayer = () => {
        onClose()
        toast({
            title: 'Player Added',
            description: `${newPlayer?.username} has been added`,
            status: 'success',
            duration: 1000,
            isClosable: true,
        })
        setDisabled(true)
        setPlayerBoxes((currBoxesArr)=> {
            const newBoxesArr = [...currBoxesArr]
            if (newPlayer){
                newBoxesArr.push(newPlayer)
            }
            return newBoxesArr
        })
        setNewPlayer(undefined)
    }
    const onAddClick = () => {
        onOpen()
        console.log(playerBoxes)
    }

    const handleStartGame = () => {
        const usersRequest = convertStateToRequestBody(playerBoxes)
        axios.post("/users", usersRequest)
        
        setTimeout(() => {
            navigate('/game')
        }, 1000);
    }

    return (
        <div>
            <Heading>New Game Setup</Heading>
            <Grid templateColumns='repeat(5, 1fr)' gap={5}>
                {
                    playerBoxes.map((playerInfo, index)=>{
                        return (
                            <GridItem>
                                <Box bg={'teal'} p={4} color={'white'} height={60} maxW={300} borderRadius={20}>
                                <Badge borderRadius='full' px='2' colorScheme='teal'>{`Player ${index}`}</Badge>
                                    <p>{playerInfo.username}</p>
                                    <Avatar bg='teal.500' />
                                </Box>
                            </GridItem>
                            )
                    })
                }
                <GridItem style={{paddingTop: 100}}>
                        <Button w='100%' h="100" leftIcon={<PlusSquareIcon/>} onClick={onAddClick}>Add player</Button>
                </GridItem>
            </Grid>
            <AddPlayerModal isOpen={isOpen} onClose={onCloseModal} addPlayer={addPlayer} handleChange={handleChange} disabled={disabled}/>
            <Button onClick={handleStartGame} size='lg'>Start</Button>
        </div>
    )
}