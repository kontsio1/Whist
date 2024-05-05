import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
} from "@chakra-ui/react";
import {useState} from "react";
import {cellCoords} from "./GameScreen";

interface tricksModalProps {
    isOpen: boolean,
    onClose: () => void
    handleChange?: (e: any) => void
    addCall: (n: number, cell: cellCoords | undefined) => void
    addTrick: (n: number, cell: cellCoords | undefined) => void
    disabled?: boolean
    selectedCell?: cellCoords
    setSelectedCell: (arg0: undefined) => void
}
enum cellButton {
    calls,
    tricks
} 
export const CallsAndTricksModal = (props: tricksModalProps) => {
    const [value, setValue] = useState<number>(0)
    const handleChange = (value: any) => setValue(value)
    const submitValues = (input: cellButton) => {
        if(input == cellButton.calls){
            props.addCall(value, props.selectedCell)
        } else if (input == cellButton.tricks) {
            props.addTrick(value, props.selectedCell)
        } else {
            throw ReferenceError
        }
        props.setSelectedCell(undefined)
        props.onClose()
    }
    
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader style={{display:"inline-block"}}>
                    <p>How many?</p>
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Slider defaultValue={0} min={0} max={6} /*to be dynamically changing*/ flex='1'
                            focusThumbOnChange={true} value={value} onChange={handleChange} colorScheme="teal">
                        <SliderTrack>
                            <SliderFilledTrack/>
                        </SliderTrack>
                        <SliderThumb fontSize='lg' boxSize='32px' children={value}/>
                    </Slider>
                    <Button colorScheme='teal' variant='outline' onClick={() => submitValues(cellButton.tricks)}>Tricks</Button>
                    <Button colorScheme='teal' variant='solid' onClick={() => submitValues(cellButton.calls)}>Calls</Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}