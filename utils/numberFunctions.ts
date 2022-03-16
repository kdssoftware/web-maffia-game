
/**
 * Ad leading numbers with zeros
 * @param num intial number
 * @param places amount of leading zeros
 * @returns a string with leading zeros, e.g. `007`
 */
export const zeroPad = (num : number, places : number) : string => {
    return String(num).padStart(places, '0')
}

/**
 * Returns a random boolean 
 * @returns  a 50/50 change on returning true of false
 */
export const randomBoolean = () :boolean => Math.random() >= 0.5;