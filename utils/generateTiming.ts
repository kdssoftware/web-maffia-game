/**
 * Generates a timestamp (in ms)
 * @param amount amount of times to multiply the wait time
 * @param waitTimeInMinutesPerAmount in minutes, amount of wait time per amount
 * @returns 
 */
const generateTiming = (amount : number, waitTimeInMinutesPerAmount : number) => {
    return Date.now() + (  amount  * waitTimeInMinutesPerAmount * 60 * 1000 )
}

export default generateTiming