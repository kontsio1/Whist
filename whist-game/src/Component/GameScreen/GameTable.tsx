import {
    callsGetRequest,
    dealerGetRequest,
    dealerPostRequest,
    scoresGetRequest,
    tricksGetRequest,
    user
} from "../../Constants";
import {cellCoords} from "./GameScreen";
import {Badge, Center, Circle, Select, Table, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {Text} from '@chakra-ui/react'
import {ScoreBubbles} from "../../Utils/ScoreBubbles";
import {ScoreBubble} from "./ScoreBubble";
import {FlamingBadge} from "../FlamingBadge";

interface gameTableProps {
    playerNames: user[],
    playerCalls: callsGetRequest[] | undefined,
    playerTricks: tricksGetRequest[] | undefined,
    playerScores: scoresGetRequest[] | undefined,
    dealersAndCards: dealerGetRequest[],
    selectedCell: cellCoords | undefined,
    onClickCell: (cell: cellCoords) => void
    addDealer: (dealer: dealerPostRequest) => void
}

export const GameTable = (props: gameTableProps) => {
    const tricks = props.playerTricks?.sort((a, b) => a.roundno - b.roundno) ?? []
    const scores = props.playerScores?.sort((a, b) => a.roundNo - b.roundNo) ?? []
    const [totalScores, setTotalScores] = useState<number[]>(Array(props.playerNames.length))
    const [startingDealer, setStartingDealer] = useState<number>()
    const currCallsLength = props.playerCalls?.length ?? 0
    const lastRoundNo = props.dealersAndCards.slice(-1)[0] ? props.dealersAndCards.slice(-1)[0].roundno : undefined
    
    const backgroundColor = 'brand.100'
    const SvgContainerStyle = {
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    }

    useEffect(() => {
        if (scores.length != 0) {
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

    const onSelectDealerChange = (player: any) => {
        setStartingDealer(player)
        props.addDealer({firstToDeal: player} as dealerPostRequest)
    }

    const newRound = {
        roundno: props.playerCalls ? props.playerCalls.length + 1 : -1,
        playerNumber: Number(props.dealersAndCards[currCallsLength] ? props.dealersAndCards[currCallsLength].dealerplayer : -1),
        get dealer() {
            if (this.roundno == 1) {
                return <Select value={startingDealer} onChange={(e) => onSelectDealerChange(e.target.value)}
                               variant={'filled'} placeholder='Who deals first'>{
                    props.playerNames.map((user) => (
                        <option value={user.id}>{user.username}</option>
                    ))
                }
                </Select>
            } else {
                return props.playerNames[this.playerNumber - 1] ? props.playerNames[this.playerNumber - 1].username : <></>
            }
        },
        get card() {
            if (props.dealersAndCards) {
                if (this.roundno == 1) {
                    return 1
                } else if (props.dealersAndCards[this.roundno - 1]) {
                    return props.dealersAndCards[this.roundno - 1].cards
                } else {
                    return ""
                }
            } else {
                return "no card found"
            }
        }
    }
    return <Table variant={'striped'} style={{ position: "relative", display: "inline-block" }}>
        <Thead>
            <Tr>
                <Th>Cards</Th>
                <Th>Dealer</Th>
                {
                    props.playerNames.map((name, index) => (
                        <Th style={{textAlign: "center"}}>
                            <FlamingBadge name={index+1} streak={0}/>
                            {/*<Badge variant={'main'} colorScheme='blue' borderRadius={10}*/}
                            {/*       padding={1}>Player {index + 1}</Badge>*/}
                            <Text>{name.username}</Text>
                        </Th>
                    ))
                }
            </Tr>
        </Thead>
        <Tbody>
            {props.playerCalls?.map((roundCalls, index) => (
                <Tr>
                    {
                        Object.keys(roundCalls).map((player, indesx) => {
                            switch (player) {
                                case ('roundno'):
                                    let playerNumber = Number(props.dealersAndCards ? props.dealersAndCards[index].dealerplayer : 0)
                                    let playerName = props.playerNames[playerNumber - 1] ? props.playerNames[playerNumber - 1].username : ""
                                    return (
                                        <>
                                            <Td>{props.dealersAndCards ? props.dealersAndCards[index].cards : ""}</Td>
                                            <Td>{playerName}</Td>
                                        </>
                                    )
                                    break
                                default:
                                    return <Td bg={props.selectedCell &&
                                    props.selectedCell.roundNo === index + 1 &&
                                    props.selectedCell.player === player
                                        ? backgroundColor
                                        : undefined}>
                                        <div onClick={() => props.onClickCell({player, roundNo: index + 1})}
                                             style={{...SvgContainerStyle, cursor: "pointer", whiteSpace: "nowrap"}}>
                                            <ScoreBubbles
                                                highlighted={(index + 1 === (props.playerCalls ? props.playerCalls.length : 1))}
                                                score={(scores.length !== 0) ? (scores[index] ? scores[index][player as keyof scoresGetRequest] : "") : ""}
                                                calls={roundCalls[player as keyof callsGetRequest]}
                                                tricks={(tricks.length !== 0) ? (tricks[index] ? tricks[index][player as keyof callsGetRequest] : "") : ""}/>
                                        </div>
                                    </Td>
                            }
                        })
                    }
                </Tr>
            ))}
            <Tr>
                {(lastRoundNo == (props.playerCalls ? props.playerCalls.length : 1)) ? <></> : <>
                    <Td>{newRound.card}</Td>
                    <Td>{newRound.dealer}</Td>
                    {
                        props.playerNames?.map((user, index) => (
                            <Td bg={props.selectedCell &&
                            props.selectedCell.roundNo === (props.playerCalls ? props.playerCalls.length + 1 : 1) &&
                            props.selectedCell.player === `player${index + 1}`
                                ? backgroundColor
                                : undefined}>
                                <div onClick={() => props.onClickCell({
                                    player: `player${index + 1}`,
                                    roundNo: (props.playerCalls ? props.playerCalls.length + 1 : 1)
                                })} style={{...SvgContainerStyle, cursor: "pointer"}}>
                                    <Badge borderRadius={10} padding={1}>New round</Badge>
                                </div>
                            </Td>
                        ))
                    }
                </>}
            </Tr>
        </Tbody>
        <Tfoot>
            <Tr>
                <Th>Total:</Th>
                <Td></Td>
                {totalScores.map((value) => (
                    <Td style={{textAlign:"center"}}><ScoreBubble value={value}/></Td>
                ))}
            </Tr>
        </Tfoot>
    </Table>
}