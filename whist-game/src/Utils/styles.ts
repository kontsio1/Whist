import {defineStyle, defineStyleConfig, extendTheme} from "@chakra-ui/react";
// https://coolors.co/100b00-694873-97d8c4-dcccff-046865

const mainButton = defineStyle(()=> {
    return {
        bg: 'brand.100',
        color: 'white',
        margin: 1,
        px: 5,
        py: 6,
        minH: '44px',
        borderRadius: 'xl',
        whiteSpace: 'normal',
        textAlign: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
            bgGradient: 'linear(to-r, brand.300, brand.100)'
        },
        _active: {
            transform: 'scale(0.98)',
        },
        _loading: { opacity: 0.8 },
    }
})
const secondaryButton = defineStyle(()=> {
    return {
        bg: 'brand.200',
        color: 'white',
        px: 5,
        py: 6,
        minH: '44px',
        borderRadius: 'xl',
        whiteSpace: 'normal',
        textAlign: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
            bgGradient: 'linear(to-r, brand.200, brand.100)'
        },
        _active: {
            transform: 'scale(0.98)',
        },
    }
})
const addPlayerButton = defineStyle(()=> {
    return {
        color: 'white',
        background: 'brand.300',
        px: 5,
        py: 6,
        minH: '44px',
        borderRadius: 'xl',
        whiteSpace: 'normal',
        textAlign: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
            bgGradient: 'linear(to-r, brand.500, brand.300)'
        },
        _active: {
            transform: 'scale(0.98)',
        }
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
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800',
            }
        }
    },
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

