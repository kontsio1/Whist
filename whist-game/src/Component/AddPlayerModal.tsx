import {
    Button,
    Input, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text, Toast, useToast
} from "@chakra-ui/react";
import {MouseEventHandler, useState} from "react";

interface modalProps {
    isOpen: boolean,
    onClose: () => void
    handleChange: (e: any) => void
    addPlayer: () => void
    disabled: boolean
}
export class PlayerCard {
    username: string
    public constructor(playerName: string) {
        this.username = playerName
    }
}
export const AddPlayerModal = (props: modalProps) => {
    const toast = useToast()
    
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Add new player</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Stack spacing={3}>
                        <Input variant='outline' placeholder='Player name' onChange={props.handleChange}/>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button isDisabled={props.disabled} variant={'solid'} colorScheme={'teal'} mr={3} onClick={props.addPlayer}>
                        Add
                    </Button>
                    <Button mr={3} onClick={props.onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}