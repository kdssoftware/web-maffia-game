const generateTiming = (amount : number, waitTimeInMinutesPerAmount : number) => {
    return Date.now() + (  amount  * waitTimeInMinutesPerAmount * 60 * 1000 )
}

export default generateTiming