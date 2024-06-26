import {
    Button, Divider, Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    List,
    ListItem, Text, useDisclosure
} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import React from "react";
import {HamburgerIcon} from "@chakra-ui/icons";

export const AppDrawer = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <div>
            <Button leftIcon={<HamburgerIcon/>} variant={'main'} onClick={onOpen}>Settings</Button>
            <Drawer isOpen={isOpen} onClose={onClose} placement={"left"}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader className={'borderlessHeader'}> Navigation </DrawerHeader>
                    <DrawerBody>
                        <List>
                            <ListItem className={"drawerLi"}><Link to={'/stats'}><b>Stats</b></Link></ListItem>
                            <Divider/>
                            <ListItem className={"drawerLi"}><Link to={'/rules'}><b>Rules</b></Link></ListItem>
                            <Divider/>
                            <ListItem className={"drawerLi"}><Link to={'/settings'}><b>Settings</b></Link></ListItem>
                            <Divider/>
                            <ListItem className={"drawerLi"}><Link to={'/about'}><b>About</b></Link></ListItem>
                        </List>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}