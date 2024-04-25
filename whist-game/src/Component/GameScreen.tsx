import {Badge, Button, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {callsGetRequest, callsPostRequest, user} from "../Constants";
import axios from "axios";
import {CallsAndTricksModal} from "./CallsAndTricksModal";

export const GameScreen = (type: any) => {
    const [playerNames, setPlayerNames] = useState<user[]>([])
    const [playerCalls, setPlayerCalls] = useState<callsGetRequest[]>()
    // const [playerScores, setPlayerScores] = useState()
    const { isOpen, onOpen, onClose, getDisclosureProps } = useDisclosure()
        
    useEffect(() => {
        getPlayersNames().then((users: user[])=>{
            setPlayerNames(users)
        })
    }, []);

    useEffect(() => {
        getPlayersCalls().then((calls: callsGetRequest[] )=>{
            setPlayerCalls(calls)
        })
    }, [playerCalls]);
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
    const addCall = async (value: number) => {
        console.log(value, "<<VALUE")
        const newCall : callsPostRequest = {roundNo: 1, player1: value}
        try {
            const resp = axios.post("/call", newCall)
            return resp
        } catch (error) {
            console.log(error)
            throw error
        }
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
                                    Object.keys(roundCalls).map((player, index)=>(
                                        player === "roundno" ? <Td isNumeric>{roundCalls.roundno}</Td> :
                                        <Td isNumeric id={index.toString()}>
                                            <div onClick={onOpen} style={{cursor: "pointer"}}>
                                                <Badge colorScheme='purple' borderRadius={10} padding={1}>{roundCalls[player as keyof callsGetRequest]}</Badge>
                                            </div>
                                        </Td>
                                    ))
                                }
                            </Tr>
                        ))}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th isNumeric>Total:</Th>
                            <Th isNumeric>125</Th>
                            <Th isNumeric>14</Th>
                            <Th isNumeric>86</Th>
                            <Th isNumeric>79</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            <CallsAndTricksModal isOpen={isOpen} onClose={onClose} addCall={addCall}/>
        </div>
    )
}