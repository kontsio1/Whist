import {
    Button, Divider, Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    List,
    ListItem, useBreakpointValue, useDisclosure
} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import React from "react";
import {HamburgerIcon} from "@chakra-ui/icons";

export const AppDrawer = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const drawerSize = useBreakpointValue({base: 'xs', md: 'sm'})

    return (
        <div>
            <Button leftIcon={<HamburgerIcon/>} variant={'main'} onClick={onOpen} size={{base: 'md', md: 'lg'}}>
                Menu
            </Button>
            <Drawer isOpen={isOpen} onClose={onClose} placement={"left"} size={drawerSize}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader className={'borderlessHeader'}> Navigation </DrawerHeader>
                    <DrawerBody>
                        <List>
                            <ListItem className={"drawerLi"}>
                                <Link to={'/stats'} onClick={onClose}><b>Stats</b></Link>
                            </ListItem>
                            <Divider/>
                            <ListItem className={"drawerLi"}>
                                <Link to={'/rules'} onClick={onClose}><b>Rules</b></Link>
                            </ListItem>
                        </List>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}