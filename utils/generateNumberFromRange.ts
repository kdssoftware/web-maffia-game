/**
 * generates a random number between the given range
 * @param min minimum number, inclusive
 * @param max maximum number, inclusive
 * @returns a random number between min and max, e.g `gen(0,10)` => `9`
 */
export const generateNumberFromRange = (min: number, max: number) : number=> {
    return Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
}