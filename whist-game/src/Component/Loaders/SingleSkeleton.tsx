import {Skeleton} from "@chakra-ui/react";
import React, {ReactNode} from "react";

export interface SkeletonProps {
    width?: number | string
    height?: number | string
    isLoaded: boolean
    children?: ReactNode;
}
export const SingleSkeleton: React.FC<SkeletonProps> = ({width, height, isLoaded, children}) => {
    return <Skeleton isLoaded={isLoaded} fadeDuration={5} width={width} height={height??'20px'} startColor='brand.300' endColor='brand.400'>
        {children}
    </Skeleton>
}