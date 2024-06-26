import {HStack, Stack} from "@chakra-ui/react";
import {SingleSkeleton} from "./SingleSkeleton";
import React, {ReactNode} from "react";

export interface SkeletonLoaderProps {
    isLoaded: boolean
    children?: ReactNode;
}
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({isLoaded, children}) => {
    return <>
        {
            isLoaded ? children :
            <Stack className={'skeletonTableLoader'}>
                <HStack>
                    <SingleSkeleton width={'16%'} isLoaded={isLoaded}/>
                    <SingleSkeleton width={'16%'} isLoaded={isLoaded}/>
                    <SingleSkeleton width={'22.66%'} isLoaded={isLoaded}/>
                    <SingleSkeleton width={'22.66%'} isLoaded={isLoaded}/>
                    <SingleSkeleton width={'22.66%'} isLoaded={isLoaded}/>
                </HStack>
                <SingleSkeleton height={'85'} isLoaded={isLoaded}/>
                <SingleSkeleton isLoaded={isLoaded}></SingleSkeleton>
            </Stack>
        }
    </>
}