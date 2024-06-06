import {Badge} from "@chakra-ui/react";
import React from "react";

interface flamingBadgeProps {
    name: number,
    streak: number
}
export const FlamingBadge = (props:flamingBadgeProps) => {
    if (props.streak==6) {
        return <div style={{position: "relative", display: "inline-block"}}>
        <Badge variant={'main'} style={{position: "relative", zIndex: 3}} borderRadius={10}
                      padding={1}>Player {props.name}</Badge>
            <img
            src="fire.gif"
            alt="Fire"
            style={{
                position: "absolute",
                bottom: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "200px", // Adjust the size as needed
                height: "auto", // Maintain aspect ratio
                zIndex: 1
            }}
        /></div>
    }
    return <div style={{position: "relative", display: "inline-block"}}>
        <Badge variant={'main'} style={{position: "relative", zIndex: 3}} borderRadius={10}
               padding={1}>Player {props.name}</Badge>
        {props.streak > 0 && <img
            src="fire.gif"
            alt="Fire"
            style={{
                position: "absolute",
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "30px", // Adjust the size as needed
                height: "auto", // Maintain aspect ratio
                zIndex: 2
            }}
        />}
        {props.streak>1 &&<img
            src="fire.gif"
            alt="Fire"
            style={{
                position: "absolute",
                bottom: "30px",
                left: "35%",
                transform: "translateX(-50%)",
                width: "25px", // Adjust the size as needed
                height: "auto", // Maintain aspect ratio
                zIndex: 2
            }}
        />}
        {props.streak>2 &&<img
            src="fire.gif"
            alt="Fire"
            style={{
                position: "absolute",
                bottom: "30px",
                left: "67%",
                transform: "translateX(-50%)",
                width: "25px", // Adjust the size as needed
                height: "auto", // Maintain aspect ratio
                zIndex: 2
            }}
        />}
        {props.streak>3 &&<img
            src="fire.gif"
            alt="Fire"
            style={{
                position: "absolute",
                bottom: "30px",
                left: "60%",
                transform: "translateX(-50%)",
                width: "35px", // Adjust the size as needed
                height: "auto", // Maintain aspect ratio
                zIndex: 1
            }}
        />}
        {props.streak>4 &&<img
            src="fire.gif"
            alt="Fire"
            style={{
                position: "absolute",
                bottom: "30px",
                left: "45%",
                transform: "translateX(-50%)",
                width: "40px", // Adjust the size as needed
                height: "auto", // Maintain aspect ratio
                zIndex: 1
            }}
        />}
    </div>
}