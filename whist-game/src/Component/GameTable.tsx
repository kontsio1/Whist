import {callsGetRequest, tricksGetRequest, user} from "../Constants";
import {cellCoords} from "./GameScreen";
import {Badge, Table, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";

interface gameTableProps {
    playerNames : user[],
    playerCalls : callsGetRequest[]|undefined,
    playerTricks : tricksGetRequest[]|undefined,
    selectedCell : cellCoords|undefined,
    onClickCell : (cell: cellCoords)=>void
}
export const GameTable =(props : gameTableProps)=> {
    const tricks = props.playerTricks?? []
    return <Table>
        <Thead>
            <Tr>
                <Th isNumeric>Round No</Th>
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
                        Object.keys(roundCalls).map((player)=>(
                            player === "roundno" ? <Td isNumeric>{roundCalls.roundno}</Td> :
                                <Td isNumeric bg={props.selectedCell &&
                                props.selectedCell.roundNo === index + 1 &&
                                props.selectedCell.player === player
                                    ? 'purple.200'
                                    : undefined}>
                                    <div onClick={() => props.onClickCell({player, roundNo: index + 1})}
                                         style={{cursor: "pointer", whiteSpace: "nowrap"}}>
                                        <Badge id="Tricks" colorScheme='green' borderRadius={10} padding={2}
                                               style={{display: "inline-block"}}>{(tricks.length!==0)? (tricks[index]? tricks[index][player as keyof callsGetRequest] : "") : ""}</Badge>
                                        <p style={{display: "inline-block", margin: "0 5px"}}>/</p>
                                        <Badge id="Calls" colorScheme='purple' borderRadius={10} padding={2}
                                               style={{display: "inline-block"}}>{roundCalls[player as keyof callsGetRequest]}</Badge>
                                    </div>
                                </Td>
                        ))
                    }
                </Tr>
            ))}
            <Tr>
                <Td isNumeric>{props.playerCalls ? props.playerCalls.length + 1 : 1}</Td>
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
                {props.playerNames.map(()=>(
                    <Td isNumeric></Td>
                ))}
            </Tr>
        </Tfoot>
    </Table>
}