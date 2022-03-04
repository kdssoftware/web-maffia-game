
export const generateNumberFromRange = (min: number, max: number) : number=> {
    return Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
}