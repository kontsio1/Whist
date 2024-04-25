import {Badge, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {callsGetRequest, callsPostRequest, user} from "../Constants";
import axios from "axios";
import {CallsAndTricksModal} from "./CallsAndTricksModal";

export interface cellCoords {
    roundNo: number,
    player: string,
}
export const GameScreen = (type: any) => {
    const [playerNames, setPlayerNames] = useState<user[]>([])
    const [playerCalls, setPlayerCalls] = useState<callsGetRequest[]>()
    const [selectedCell, setSelectedCell] = useState<cellCoords|undefined>()
    // const [playerScores, setPlayerScores] = useState()
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
        console.log(value,cell, "<<VALUE")
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
    
    // const calculateColumnSum = (array: callsGetRequest[], column: string) => {
    //     const player = column as keyof callsGetRequest
    //     const sum = array.reduce((accumulator, currentValue) => {
    //         return accumulator + currentValue[player];
    //     }, 0);
    // }
    const onClickCell = (cell: cellCoords) => {
        setSelectedCell(cell)
        onOpen()
    }
    
    return (
        <div>
            <header>Game screen</header>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th isNumeric>Round No</Th>
                            {
                                playerNames.map((name, index) => (
                                    <Th isNumeric>
                                        <Badge colorScheme='blue' borderRadius={10}
                                               padding={1}>Player {index + 1}</Badge>
                                        <p>{name.username}</p>
                                    </Th>
                                ))
                            }
                        </Tr>
                    </Thead>
                    <Tbody>
                        {playerCalls?.map((roundCalls, index)=>(
                            <Tr>
                                {
                                    Object.keys(roundCalls).map((player)=>(
                                        player === "roundno" ? <Td isNumeric>{roundCalls.roundno}</Td> :
                                        <Td isNumeric bg={selectedCell &&
                                        selectedCell.roundNo === index+1 &&
                                        selectedCell.player === player
                                            ? 'purple.200'
                                            : undefined}>
                                            <div onClick={()=> onClickCell({player,roundNo:index+1})} style={{cursor: "pointer"}}>
                                                <Badge colorScheme='purple' borderRadius={10} padding={1}>{roundCalls[player as keyof callsGetRequest]}</Badge>
                                            </div>
                                        </Td>
                                    ))
                                }
                            </Tr>
                        ))}
                        <Tr>
                                <Td isNumeric>{playerCalls? playerCalls.length+1 : 1}</Td>
                                {
                                    playerNames?.map((user, index)=>(
                                        <Td isNumeric bg={selectedCell &&
                                            selectedCell.roundNo === (playerCalls? playerCalls.length+1 : 1) &&
                                            selectedCell.player === `player${index+1}`
                                            ? 'purple.200'
                                            : undefined}>
                                        <div onClick={()=> onClickCell({player: `player${index+1}`,roundNo:(playerCalls? playerCalls.length+1 : 1)})} style={{cursor: "pointer"}}>
                                            <Badge colorScheme='purple' borderRadius={10} padding={1}>New round</Badge>
                                        </div>
                                    </Td>
                                    ))
                                }
                        </Tr>
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th isNumeric>Total:</Th>
                            {playerNames.map(()=>(
                                <Td isNumeric></Td>
                            ))}
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            <CallsAndTricksModal isOpen={isOpen} onClose={onClose} addCall={addCall} selectedCell={selectedCell} setSelectedCell={setSelectedCell}/>
        </div>
    )
}