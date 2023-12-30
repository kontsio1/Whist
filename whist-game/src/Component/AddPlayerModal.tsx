import {
    Button,
    Input, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text
} from "@chakra-ui/react";

interface modalProps {
    isOpen: boolean,
    onClose: () => void
    addPlayer: () => void
}

export const AddPlayerModal = (props: modalProps) => {
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Add new player</ModalHeader>
                <ModalCloseButton/>

                <ModalBody>
                    <Stack spacing={3}>
                        <Input variant='outline' placeholder='Player name'/>
                        <div>
                            <Text fontSize={15}>Visible as:</Text>
                            <Input variant='outline' placeholder='nickname'/>
                        </div>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button variant={'solid'} colorScheme={'teal'} mr={3} onClick={props.addPlayer}>
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