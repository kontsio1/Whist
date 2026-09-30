import {
    Avatar,
    Badge,
    Box, Button, Flex, SimpleGrid, Stack, Text,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {ArrowForwardIcon, PlusSquareIcon} from "@chakra-ui/icons";
import {AddPlayerModal, PlayerCard} from "./AddPlayerModal";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {user} from "../Constants";
import api from "../api";

export const GameSetup = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()
    const [playerBoxes, setPlayerBoxes] = useState<PlayerCard[]>([])
    const [disabled, setDisabled] = useState<boolean>(true)
    const [newPlayer, setNewPlayer] = useState<PlayerCard>()
    const [loading, setLoading] = useState<boolean>(false)
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
        setPlayerBoxes((currBoxesArr: PlayerCard[])=> {
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
        setLoading(true)
        const usersRequest = convertStateToRequestBody(playerBoxes)
        api.post("/users", usersRequest).then(()=>{
            setLoading(false)
            navigate('/game')
        })
    }

    return (
        <Box className={'pageSection'}>
            <header>New Game Setup</header>
            <Text className={'helperText'}>
                Add players first, then start or resume a game. The layout wraps automatically for smaller screens.
            </Text>
            <SimpleGrid minChildWidth={{base: '9rem', md: '10rem'}} spacing={4}>
                {
                    playerBoxes.map((playerInfo: PlayerCard, index: number)=>{
                        return (
                            <Box key={`${playerInfo.username}-${index}`} className={"playerBox"}>
                                <Badge borderRadius='full' px='2' colorScheme='teal'>{`Player ${index + 1}`}</Badge>
                                <Text fontWeight={'semibold'} noOfLines={2}>{playerInfo.username}</Text>
                                <Flex justify={'center'}>
                                    <Avatar bg='teal.500' />
                                </Flex>
                            </Box>
                            )
                    })
                }
                <Flex align={'stretch'}>
                    <Button variant="custom" className={"bigCustomButton"} leftIcon={<PlusSquareIcon/>} onClick={onAddClick}>
                        Add player
                    </Button>
                </Flex>
            </SimpleGrid>
            <AddPlayerModal isOpen={isOpen} onClose={onCloseModal} addPlayer={addPlayer} handleChange={handleChange} disabled={disabled}/>
            <Stack direction={{base: 'column', md: 'row'}} spacing={3}>
                <Button variant={'main'} onClick={handleStartGame} isLoading={loading} isDisabled={playerBoxes.length === 0}>
                    Start
                </Button>
                <Link to={'/game'}>
                    <Button variant={'main'} aria-label='resume game' rightIcon={<ArrowForwardIcon/>} w={{base: '100%', md: 'auto'}}>
                        Resume game
                    </Button>
                </Link>
            </Stack>
        </Box>
    )
}
