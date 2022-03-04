
const generateCode = () : string => {
    const code = Date.now().toString(8).split("").reverse().splice(0,12).join("");
    return code.substring(0,4) + "." + code.substring(4,8) + "." + code.substring(8,12);
     
}

export default generateCode;
