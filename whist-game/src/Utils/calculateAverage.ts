export const calculateAverage = (array: number[] | undefined) => {
    if(!array) { return -1 }
    if (array.length > 0){
        const sum = array.reduce((partialSum, a) => partialSum + a, 0);
        return sum/array.length
    } else {
        return -1
    }
}