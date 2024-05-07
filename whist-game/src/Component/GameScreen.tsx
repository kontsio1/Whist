import {TableContainer, useDisclosure} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {
    callsGetRequest,
    callsPostRequest,
    scoresGetRequest,
    tricksGetRequest,
    tricksPostRequest,
    user
} from "../Constants";
import axios from "axios";
import {CallsAndTricksModal} from "./CallsAndTricksModal";
import {GameTable} from "./GameTable";

export interface cellCoords {
    roundNo: number,
    player: string,
}
export const GameScreen = (type: any) => {
    const [playerNames, setPlayerNames] = useState<user[]>([])
    const [playerCalls, setPlayerCalls] = useState<callsGetRequest[]>()
    const [playerTricks, setPlayerTricks] = useState<tricksGetRequest[]>()
    const [selectedCell, setSelectedCell] = useState<cellCoords|undefined>()
    const [playerScores, setPlayerScores] = useState<scoresGetRequest[]>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    useEffect(() => {
        getPlayersNames().then((users: user[])=>{
            setPlayerNames(users)
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
    const addCall = async (value: number, cell: cellCoords | undefined) => {
        if(cell){
            const newCall : callsPostRequest = {roundNo: cell.roundNo, [cell.player]: value}
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
        onOpen()
    }
    
    // const calculateColumnSum = (array: callsGetRequest[], column: string) => {
    //     const player = column as keyof callsGetRequest
    //     const sum = array.reduce((accumulator, currentValue) => {
    //         return accumulator + currentValue[player];
    //     }, 0);
    // }
    
    return (
        <div>
            <header>Game screen</header>
            <TableContainer>
                <GameTable playerNames={playerNames} playerCalls={playerCalls} playerTricks={playerTricks} playerScores={playerScores} selectedCell={selectedCell} onClickCell={onClickCell} />
            </TableContainer>
            <CallsAndTricksModal isOpen={isOpen} onClose={onClose} addCall={addCall} addTrick={addTrick} selectedCell={selectedCell} setSelectedCell={setSelectedCell}/>
        </div>
    )
}