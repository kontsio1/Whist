import {Button, IconButton, TableContainer, useDisclosure, useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {
    callsGetRequest,
    callsPostRequest, dealerGetRequest, dealerPostRequest,
    scoresGetRequest,
    tricksGetRequest,
    tricksPostRequest,
    user
} from "../Constants";
import axios from "axios";
import {CallsAndTricksModal} from "./CallsAndTricksModal";
import {GameTable} from "./GameTable";
import {Link} from "react-router-dom";
import {ArrowBackIcon} from "@chakra-ui/icons";

export interface cellCoords {
    roundNo: number,
    player: string,
}
export interface maxCallsTricksForCell {
    calls: number,
    tricks: number
}
export const GameScreen = (type: any) => {
    const initialDealerAndCardsState: dealerGetRequest[] = [{
        roundno: 0,
        cards: 1,
        dealerplayer: "dealer not found"
    }]
    const toast = useToast()
    const [playerNames, setPlayerNames] = useState<user[]>([])
    const [playerCalls, setPlayerCalls] = useState<callsGetRequest[]>()
    const [playerTricks, setPlayerTricks] = useState<tricksGetRequest[]>()
    const [selectedCell, setSelectedCell] = useState<cellCoords|undefined>()
    const [playerScores, setPlayerScores] = useState<scoresGetRequest[]>()
    const [dealerAndCards, setDealerAndCards] = useState<dealerGetRequest[]>(initialDealerAndCardsState)
    const [maxCallsTricksForCell, setMaxTricksCallsForCell] = useState<maxCallsTricksForCell>({calls:0,tricks:0})
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    useEffect(() => {
        getPlayersNames().then((users: user[])=>{
            setPlayerNames(users)
        })
        getDealersAndCards().then((dealersAndCards: dealerGetRequest[])=>{
            setDealerAndCards(dealersAndCards)
        })
        updateUsersAndScores()
    }, []);

    useEffect(() => {
        
    }, []); //change here instead of playerCalls
    const updateUsersAndScores = async()=> {
        getPlayersCalls().then((calls: callsGetRequest[] )=>{
            setPlayerCalls(calls)
        })
        getPlayersTricks().then((tricks: tricksGetRequest[])=>{
            setPlayerTricks(tricks)
        })
        getScores().then((scores: scoresGetRequest[])=>{
            setPlayerScores(scores)
        })
        
    }
    const getPlayersCalls = async (): Promise<callsGetRequest[]> => {
        try {
            const resp = await axios.get("/calls");
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const getScores = async (): Promise<scoresGetRequest[]> => {
        try {
            const resp = await axios.get("/scores");
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const getPlayersTricks = async (): Promise<tricksGetRequest[]> => {
        try {
            const resp = await axios.get("/tricks");
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const getPlayersNames = async (): Promise<user[]> => {
        try {
            const resp = await axios.get("/users");
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    const getDealersAndCards = async (): Promise<dealerGetRequest[]> => {
        try {
            const resp = await axios.get("/dealer");
            return resp.data;
        } catch (error) {
            console.log("Error in get /dealer",error)
            throw error
        }
    }
    const addCall = async (value: number, cell: cellCoords | undefined) => {
        if(cell){
            const newCall : callsPostRequest = {roundNo: cell.roundNo, [cell.player]: value}
            const dealerRound = dealerAndCards.find(d => d.roundno === cell.roundNo)
             let callsRound = playerCalls?.find(c => c.roundno == cell.roundNo)
                if(callsRound){
                    callsRound = removeKeyFromObject(callsRound, cell.player as keyof callsGetRequest)
                    const total = Object.values(callsRound).reduce((acc, val) => {
                        if (val == null){
                            return -100
                        }
                            return acc + val
                    }, -callsRound.roundno);
                    if(total+value == dealerRound?.cards){
                        return toast({
                            title: 'Call sum matches total tricks',
                            description: `Sorry can't make that call`,
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                    })
                    }
                } else {
                    console.log("round is undefined")
                }
            try {
                await axios.post("/call", newCall)
                await updateUsersAndScores()
            } catch (error) {
                console.log(error)
                throw error
            }
        } else {
            throw ReferenceError
        }
    }
    const addTrick = async (value: number, cell: cellCoords | undefined) => {
        if(cell){
            const newTrick : tricksPostRequest = {roundNo: cell.roundNo, [cell.player]: value}
            try {
                await axios.post("/trick", newTrick)
                await updateUsersAndScores()
            } catch (error) {
                console.log(error)
                throw error
            }
        } else {
            throw ReferenceError
        }
    }
    const onClickCell = (cell: cellCoords) => {
        setSelectedCell(cell)
        if(dealerAndCards.length !=0){
            const dealerRow = dealerAndCards.find((d)=> d.roundno == cell.roundNo)
            setMaxTricksCallsForCell({calls:dealerRow?.cards?? 10, tricks:dealerRow?.cards?? 10})
        }
        onOpen()
    }
    const addDealer = async (newDealer: dealerPostRequest) => {
        try {
            await axios.post("/dealer", newDealer)
            // await getDealersAndCards() too fast a request issue
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    function removeKeyFromObject(obj:callsGetRequest, keyToRemove: keyof callsGetRequest) {
        const newObj = { ...obj };
        delete newObj[keyToRemove as keyof callsGetRequest];
        return newObj;
    }
    
    return (
        <div style={{padding:200}}>
            <header>Game screen</header>
            <Link to={'/setup'}><IconButton variant={'main'} aria-label='go back' icon={<ArrowBackIcon/>}>Back</IconButton></Link>
            <TableContainer>
                <GameTable addDealer={addDealer} playerNames={playerNames} playerCalls={playerCalls} playerTricks={playerTricks} playerScores={playerScores} dealersAndCards={dealerAndCards} selectedCell={selectedCell} onClickCell={onClickCell} />
            </TableContainer>
            <CallsAndTricksModal isOpen={isOpen} onClose={onClose} addCall={addCall} addTrick={addTrick} selectedCell={selectedCell} setSelectedCell={setSelectedCell} maxTricksAndCalls={maxCallsTricksForCell}/>
            <Link to={'/endGame'}><Button variant={'main'}>End Game</Button></Link>
        </div>
    )
}