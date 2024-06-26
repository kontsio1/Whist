import {
    Button, Center, Circle, CircularProgress, DrawerHeader, HStack, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay, Spinner,
    useNumberInput
} from "@chakra-ui/react";
import {CSSProperties, useState} from "react";
import {cellCoords, maxCallsTricksForCell} from "./GameScreen";

interface tricksModalProps {
    isOpen: boolean,
    onClose: () => void
    handleChange?: (e: any) => void
    addCall: (n: number, cell: cellCoords | undefined) => any
    addTrick: (n: number, cell: cellCoords | undefined) => any
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
    const [loading, setLoading] = useState<boolean>(false)
    const submitValues = (inputStatus: cellButton) => {
        setLoading(true)
        if (inputStatus == cellButton.calls) {
            props.addCall(input.value, props.selectedCell).then(() => {
                setLoading(false)
                props.onClose()
            })
        } else if (inputStatus == cellButton.tricks) {
            props.addTrick(input.value, props.selectedCell).then(() => {
                setLoading(false)
                props.onClose()
            })
        } else {
            throw ReferenceError
        }
        props.setSelectedCell(undefined)
        // props.onClose()
    }
    const {getInputProps, getIncrementButtonProps, getDecrementButtonProps} =
        useNumberInput({
            step: 1,
            defaultValue: 0,
            min: 0,
            max: 13,
            precision: 0,
            allowMouseWheel: true
        })
    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps()

    const containerStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader className={'borderlessHeader'} style={{display: "inline-block"}}>
                    <p>How many?</p>
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <div style={containerStyle}>
                        <HStack maxW='300px' style={{padding: 30}}>
                            <Button size={'lg'} {...dec}>-</Button>
                            <Input size={'lg'} style={{textAlign: 'center'}} {...input}/>
                            <Button size={'lg'} {...inc}>+</Button>
                        </HStack>
                        <HStack>
                            <Circle size={100} bg='brand.200' color='black' _hover={{bg: "brand.100", color: "white"}}>
                                {
                                    loading ? <CircularProgress size={70} isIndeterminate trackColor='inherit' color='rgb(237, 242, 247)'/> :
                                        <Button isLoading={loading} variant='unstyled'
                                                onClick={() => submitValues(cellButton.tricks)}>Tricks</Button>
                                }
                            </Circle>
                            <Circle size={100} bg='brand.400' color='black' _hover={{bg: "brand.300", color: "white"}}>
                                {
                                    loading ? <CircularProgress size={70} isIndeterminate trackColor='inherit' color='rgb(237, 242, 247)'/> :
                                        <Button variant='unstyled'
                                                onClick={() => submitValues(cellButton.calls)}>Calls</Button>
                                }
                            </Circle>
                        </HStack>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}