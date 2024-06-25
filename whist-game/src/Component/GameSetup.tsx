import {
    Avatar,
    Badge,
    Box, Button, Center, Grid, GridItem,
    Heading, IconButton,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {ArrowBackIcon, ArrowForwardIcon, PlusSquareIcon} from "@chakra-ui/icons";
import {AddPlayerModal, PlayerCard} from "./AddPlayerModal";
import React, {MouseEventHandler, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {user} from "../Constants";
import api from "../api";

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
    }

    const handleStartGame = () => {
        const usersRequest = convertStateToRequestBody(playerBoxes)
        api.post("/users", usersRequest).then((response)=>{
            navigate('/game')
        })
    }

    return (
        <div>
            <header>New Game Setup</header>
            <Grid templateColumns='repeat(5, 1fr)' gap={5}>
                {
                    playerBoxes.map((playerInfo, index)=>{
                        return (
                            <GridItem>
                                <Box className={"playerBox"}>
                                    <Badge borderRadius='full' px='2' colorScheme='teal'>{`Player ${index}`}</Badge>
                                    <p>{playerInfo.username}</p>
                                    <Avatar bg='teal.500' />
                                </Box>
                            </GridItem>
                            )
                    })
                }
                <GridItem style={{margin:"auto"}}>
                    <Button variant="custom" className={"bigCustomButton"} leftIcon={<PlusSquareIcon/>} onClick={onAddClick}>Add player</Button>
                </GridItem>
            </Grid>
            <AddPlayerModal isOpen={isOpen} onClose={onCloseModal} addPlayer={addPlayer} handleChange={handleChange} disabled={disabled}/>
            <Button variant={'main'} onClick={handleStartGame}>Start</Button>
            <Link to={'/game'}><Button variant={'main'} aria-label='go back' rightIcon={<ArrowForwardIcon/>}>Resume game</Button></Link>
        </div>
    )
}
