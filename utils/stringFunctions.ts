import { zeroPad  as z} from "@utils/numberFunctions";
import { generateNumberFromRange as gen } from "@utils/numberFunctions";
import { getUserByName } from "@controller/User";

export const DEFAULT_CHARS ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a code. This is used for inviations of other users.
 * @returns a code with format `xxx.xxx.xxx` where x is a random number
 */
export const generateCode = () : string => {
     return `${z(gen(0,999),3)}.${z(gen(0,999),3)}.${z(gen(0,999),3)}`;
}


/**
 * generates a random string of the given length.
 * If given character, it will only use the given characters.
 * @param length the lenght of the string
 * @param characters the characters to use. defaulting to DEFAULT_CHARS
 * @returns a random string. e.g `(3, 'ABC')` => `'AAA' or `'BCA'` or ...
 */
export const generateString = (length : number, characters:string=DEFAULT_CHARS) => {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

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
 * generates a random username using the randomuser.me API.
 * If the username is already taken, it will generate a new one.
 * After 5 trimes not having a unique username, it will generate a random string with 33 chars as length.
 * @returns a random username
 */
export const generateRandomName = async () : Promise<string> => {
    let times = 0
    let timeUntilFail = 5;
    do{
        const name = await fetchRandomUsernameFromExternalAPI();
        const nameFoundInDB = await getUserByName(name);
        if(!nameFoundInDB){
            return name;
        }
        times++
    }while(times<=timeUntilFail);
    return generateString(33);
    
}

/**
 * Fetch a random username from the randomuser.me API.
 * @returns username, e.g : `'John2z'`
 */
export const fetchRandomUsernameFromExternalAPI = async () : Promise<string> => {
    const data = await fetch('https://api.randomuser.me/')
    const json = await data.json()
    return json.results[0].login.username+generateString(2,"XYZ0123456789_!");
}
/**
 * Tests the username if it is valid
 * @param username the username
 * @returns A boolean if the username is valid
 */
export const validateUsername = (username : string) : boolean => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}