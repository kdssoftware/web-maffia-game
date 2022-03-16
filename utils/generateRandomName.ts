import { getUserByName } from "@controller/User";
import generateString from "@utils/generateString";

/**
 * generates a random username using the randomuser.me API.
 * If the username is already taken, it will generate a new one.
 * After 5 trimes not having a unique username, it will generate a random string with 33 chars as length.
 * @returns a random username
 */
const generateRandomName = async () : Promise<string> => {
    let times = 0
    let timeUntilFail = 5;
    do{
        const name = await fetchUsername();
        const nameFoundInDB = await getUserByName(name);
        if(!nameFoundInDB){
            return name;
        }
        times++
    }while(times<=timeUntilFail);
    return generateString(33);
    
}
const fetchUsername = async () : Promise<string> => {
    const data = await fetch('https://api.randomuser.me/')
    const json = await data.json()
    return json.results[0].login.username+generateString(2,"XYZ0123456789_!");
}

export default generateRandomName