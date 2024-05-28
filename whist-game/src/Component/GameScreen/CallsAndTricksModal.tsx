import {
    Button, Center, Circle, HStack, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay, NumberInput,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack, useNumberInput, VStack,
} from "@chakra-ui/react";
import {CSSProperties, useState} from "react";
import {cellCoords, maxCallsTricksForCell} from "./GameScreen";

interface tricksModalProps {
    isOpen: boolean,
    onClose: () => void
    handleChange?: (e: any) => void
    addCall: (n: number, cell: cellCoords | undefined) => void
    addTrick: (n: number, cell: cellCoords | undefined) => void
    disabled?: boolean
    selectedCell?: cellCoords
    setSelectedCell: (arg0: undefined) => void
    maxTricksAndCalls: maxCallsTricksForCell
}

enum cellButton {
    calls,
    tricks
}

export const CallsAndTricksModal = (props: tricksModalProps) => {
    const submitValues = (inputStatus: cellButton) => {
        if (inputStatus == cellButton.calls) {
            props.addCall(input.value, props.selectedCell)
        } else if (inputStatus == cellButton.tricks) {
            props.addTrick(input.value, props.selectedCell)
        } else {
            throw ReferenceError
        }
        props.setSelectedCell(undefined)
        props.onClose()
    }
    const {getInputProps, getIncrementButtonProps, getDecrementButtonProps} =
        useNumberInput({
            step: 1,
            defaultValue: 0,
            min: 0,
            max: 9,
            precision: 0,
            allowMouseWheel: true
        })
    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps()

    const containerStyle: CSSProperties = {
        display:"flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"center",
    }
    
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader style={{display: "inline-block"}}>
                    <p>How many?</p>
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <div style={containerStyle}>
                        <HStack maxW='300px' style={{padding:30}}>
                            <Button size={'lg'} {...inc}>+</Button>
                            <Input size={'lg'} style={{textAlign: 'center'}} {...input}/>
                            <Button size={'lg'} {...dec}>-</Button>
                        </HStack>
                    <HStack>
                        <Circle size={100} bg='brand.200' color='black' _hover={{ bg: "brand.100", color:"white" }}>
                            <Button variant='unstyled' onClick={() => submitValues(cellButton.tricks)}>Tricks</Button>
                        </Circle>
                        <Circle size={100} bg='brand.400' color='black' _hover={{ bg: "brand.300", color:"white"}}>
                            <Button variant='unstyled' onClick={() => submitValues(cellButton.calls)}>Calls</Button>
                        </Circle>
                    </HStack>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}