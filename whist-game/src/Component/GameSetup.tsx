import {
    Button,
    Heading, Input,
    Modal, ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Stack, Text,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {PlusSquareIcon} from "@chakra-ui/icons";
import {AddPlayerModal} from "./AddPlayerModal";

export const GameSetup = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()
    const addPlayer = () => {
        onClose()
        toast({
            title: 'Player Added',
            description: '${player_name} has been added',
            status: 'success',
            duration: 1000,
            isClosable: true,
        })
    }

    return (
        <div>
            <Heading>New Game Setup</Heading>
            <Button leftIcon={<PlusSquareIcon/>} onClick={onOpen}>Add player</Button>
            <AddPlayerModal isOpen={isOpen} onClose={onClose} addPlayer={addPlayer}/>
        </div>
    )
}