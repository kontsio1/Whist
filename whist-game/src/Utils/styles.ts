import {defineStyle, defineStyleConfig, extendTheme} from "@chakra-ui/react";
// https://coolors.co/100b00-694873-97d8c4-dcccff-046865

const mainButton = defineStyle(()=> {
    return {
        bg: 'brand.100',
        color: 'white',
        margin: 5,
        '&:hover': {
            transform: 'scale(1.2)',
        },
    }
})
const secondaryButton = defineStyle(()=> {
    return {
        bg: 'brand.200',
        color: 'white',
        '&:hover': {
            transform: 'scale(1.2)',
        },
    }
})
const addPlayerButton = defineStyle(()=> {
    return {
        color: 'white',
        bgGradient: 'linear(to-r, brand.300, brand.100)',
    }
})
const playerNameBadge = defineStyle(()=> {
    return {
        color: 'white',
        bg: 'brand.300',
        margin: 5,
    }
})

const buttonTheme = defineStyleConfig({
    variants: {
        main: mainButton,
        secondary: secondaryButton,
        custom: addPlayerButton,
    },
})
const badgeTheme = defineStyleConfig({
    variants: {
        main: playerNameBadge,
    },
})


export const theme = extendTheme({
    colors: {
        brand: {
            100: "#046865",
            200: "#97d8c4",
            300: "#694873",
            400: "#dcccff",
            500: "#100b00",
        },
    },
    components: {
        Button: buttonTheme,
        Badge: badgeTheme
    }
})

