export const DEFAULT_CHARS ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * generates a random string of the given length.
 * If given character, it will only use the given characters.
 * @param length the lenght of the string
 * @param characters the characters to use. defaulting to DEFAULT_CHARS
 * @returns a random string. e.g `(3, 'ABC')` => `'AAA' or `'BCA'` or ...
 */
const generateString = (length : number, characters:string=DEFAULT_CHARS) => {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export default generateString;