import { getUserByName } from "@controller/User";
import generateString from "@utils/generateString";

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
    return json.results[0].login.username;
}

export default generateRandomName