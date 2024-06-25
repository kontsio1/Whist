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

// const useStyles = makeStyles((theme) => ({
//     listItem: {
//         padding: 10
//     }
// }));
export const AppDrawer = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    // const classes = useStyles();
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
                            <ListItem><Link to={'/stats'}><b>Stats</b></Link></ListItem>
                            <Divider/>
                            <ListItem><Link to={'/rules'}><b>Rules</b></Link></ListItem>
                            <Divider/>
                            <ListItem><Link to={'/settings'}><b>Settings</b></Link></ListItem>
                            <Divider/>
                            <ListItem><Link to={'/about'}><b>About</b></Link></ListItem>
                        </List>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}