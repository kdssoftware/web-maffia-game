/**
 * convert ms to min
 * @param millis amount of milliseconds
 * @returns amount of minutes
 */
export default function msToMin(millis : number) : string {
    let minutes = Math.floor(millis / 60000);
    let seconds : string = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  }