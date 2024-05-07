import {callsGetRequest, dealerGetRequest, scoresGetRequest, tricksGetRequest, user} from "../Constants";
import {cellCoords} from "./GameScreen";
import {Badge, Select, Table, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
interface gameTableProps {
    playerNames : user[],
    playerCalls : callsGetRequest[]|undefined,
    playerTricks : tricksGetRequest[]|undefined,
    playerScores : scoresGetRequest[]|undefined,
    dealersAndCards : dealerGetRequest[],
    selectedCell : cellCoords|undefined,
    onClickCell : (cell: cellCoords)=>void
}
export const GameTable =(props : gameTableProps)=> {
    const tricks = props.playerTricks?.sort((a, b) => a.roundno - b.roundno)?? []
    const scores = props.playerScores?.sort((a, b) => a.roundNo - b.roundNo)?? []
    const [totalScores, setTotalScores]=useState<number[]>(Array(props.playerNames.length))
    
    const currCallsLength = props.playerCalls?.length?? 0
    
    useEffect(() => {
        if(scores.length != 0) {
            const activePlayerKeys = Object.keys(scores[0]).slice(1)
            setTotalScores(
                activePlayerKeys.map((player) =>
                    scores.reduce((acc, obj) => {
                        if (obj !== null && player !== null) {
                            return acc + (obj[player as keyof scoresGetRequest] ?? 0);
                        } else {
                            return acc;
                        }
                    }, 0))
            )
        }
    }, [props.playerTricks, props.playerCalls]);

    const newRound = {
        roundno: props.playerCalls ? props.playerCalls.length+1: -1,
        playerNumber: Number(props.dealersAndCards[currCallsLength] ? props.dealersAndCards[currCallsLength].dealerplayer : -1),
        get dealer() {
            if(this.roundno == 1) {
                return <Select placeholder='Who deals first'>
                    <option value='option1'>Option 1</option>
                    <option value='option2'>Option 2</option>
                    <option value='option3'>Option 3</option>
                </Select>
            } else {
                return props.playerNames[this.playerNumber-1] ? props.playerNames[this.playerNumber-1].username : <></>
            }
        },
        get card() {
            if(props.dealersAndCards) {
                if(this.roundno == 1){
                    return 1 
                } else if(props.dealersAndCards[this.roundno-1]) {
                    return props.dealersAndCards[this.roundno-1].cards
                } else {
                    return "no card found"
                }
            } else {
                return ""
            }
        }
    }
    return <Table>
        <Thead>
            <Tr>
                <Th isNumeric>Cards</Th>
                <Th isNumeric>Dealer</Th>
                {
                    props.playerNames.map((name, index) => (
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
            {props.playerCalls?.map((roundCalls, index)=>(
                <Tr>
                    {
                        Object.keys(roundCalls).map((player, indesx)=> {
                            switch (player) {
                                case ('roundno'):
                                    let playerNumber = Number(props.dealersAndCards ? props.dealersAndCards[index].dealerplayer : 0)
                                    let playerName = props.playerNames[playerNumber-1]? props.playerNames[playerNumber-1].username : ""
                                    return (
                                        <>
                                            <Td isNumeric>{props.dealersAndCards ? props.dealersAndCards[index].cards : ""}</Td>
                                            <Td isNumeric>{playerName}</Td>
                                        </>
                                    )
                                    break
                                default:
                                        return <Td isNumeric bg={props.selectedCell &&
                                        props.selectedCell.roundNo === index + 1 &&
                                        props.selectedCell.player === player
                                            ? 'purple.200'
                                            : undefined}>
                                            <div onClick={() => props.onClickCell({player, roundNo: index + 1})}
                                                 style={{cursor: "pointer", whiteSpace: "nowrap"}}>
                                                <Badge id="Tricks" colorScheme='green' borderRadius={10} padding={2}
                                                       style={{display: "inline-block"}}>{(tricks.length !== 0) ? (tricks[index] ? tricks[index][player as keyof callsGetRequest] : "") : ""}</Badge>
                                                <p style={{display: "inline-block", margin: "0 5px"}}>/</p>
                                                <Badge id="Calls" colorScheme='purple' borderRadius={10} padding={2}
                                                       style={{display: "inline-block"}}>{roundCalls[player as keyof callsGetRequest]}</Badge>
                                            </div>
                                            <p>{(scores.length !== 0) ? (scores[index] ? scores[index][player as keyof scoresGetRequest] : "") : ""}</p>
                                        </Td>
                            }
                        })
                    }
                </Tr>
            ))}
            <Tr>
                <Td isNumeric>{newRound.card}</Td>
                <Td isNumeric>{newRound.dealer}</Td>
                {
                    props.playerNames?.map((user, index) => (
                        <Td isNumeric bg={props.selectedCell &&
                        props.selectedCell.roundNo === (props.playerCalls ? props.playerCalls.length + 1 : 1) &&
                        props.selectedCell.player === `player${index + 1}`
                            ? 'purple.200'
                            : undefined}>
                            <div onClick={() => props.onClickCell({
                                player: `player${index + 1}`,
                                roundNo: (props.playerCalls ? props.playerCalls.length + 1 : 1)
                            })} style={{cursor: "pointer"}}>
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
                <Td></Td>
                {totalScores.map((value)=>(
                    <Td isNumeric>{value}</Td>
                ))}
            </Tr>
        </Tfoot>
    </Table>
}