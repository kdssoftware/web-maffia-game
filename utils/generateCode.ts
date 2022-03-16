import { zeroPad  as z} from "@utils/numberFunctions";
import { generateNumberFromRange as gen } from "@utils/generateNumberFromRange";

/**
 * Generates a code. This is used for inviations of other users.
 * @returns a code with format `xxx.xxx.xxx` where x is a random number
 */
 const generateCode = () : string => {
     return `${z(gen(0,999),3)}.${z(gen(0,999),3)}.${z(gen(0,999),3)}`;
}

export default generateCode;
