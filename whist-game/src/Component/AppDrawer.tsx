import {
    Button, Divider, Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    List,
    ListItem, useDisclosure
} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import React from "react";
import {HamburgerIcon} from "@chakra-ui/icons";

export const AppDrawer = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <div>
            <Button leftIcon={<HamburgerIcon/>} colorScheme='teal' onClick={onOpen}>Settings</Button>
            <Drawer isOpen={isOpen} onClose={onClose} placement={"left"}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader>Navigation </DrawerHeader>
                    <DrawerBody>
                        <List>
                            <ListItem><Link to={'/stats'}><Button variant={'ghost'}>Stats</Button></Link></ListItem>
                            <Divider/>
                            <ListItem><Link to={'/rules'}><Button variant={'ghost'}>Rules</Button></Link></ListItem>
                            <Divider/>
                            <ListItem><Link to={'/settings'}><Button variant={'ghost'}>Settings</Button></Link></ListItem>
                            <Divider/>
                            <ListItem><Link to={'/about'}><Button variant={'ghost'}>About</Button></Link></ListItem>
                        </List>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}