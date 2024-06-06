export const findMaxValue = (arr: number[] | undefined) => {
    if(!arr){ return {max:-1,maxIndex:-1}}
    if (arr.length === 0) {
        return {max:-1,maxIndex:-1};
    }
    
    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return {max,maxIndex};
}