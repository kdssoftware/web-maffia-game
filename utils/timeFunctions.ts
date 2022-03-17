/**
 * convert ms to min
 * @param millis amount of milliseconds
 * @returns amount of minutes
 */
 export function msToMin(millis : number) : string {
    let minutes = Math.floor(millis / 60000);
    let seconds : string = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  }

  /**
 * Generates a timestamp (in ms)
 * @param amount amount of times to multiply the wait time
 * @param waitTimeInMinutesPerAmount in minutes, amount of wait time per amount
 * @returns 
 */
export const generateTiming = (amount : number, waitTimeInMinutesPerAmount : number) => {
    return Date.now() + (  amount  * waitTimeInMinutesPerAmount * 60 * 1000 )
}
