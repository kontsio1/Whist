import {Center, Circle} from "@chakra-ui/react";
import React from "react";

interface ScoreBubbleProps {
    value: number
}

export const ScoreBubble = (props: ScoreBubbleProps) => {
    const style = {
        fontSize: 25,
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.8)'
        }
    }
    
    return <Center><Circle fontFamily={"Oregano"} sx={style} size={10} bg={'brand.300'} color={'white'}>{props.value}</Circle></Center>
}