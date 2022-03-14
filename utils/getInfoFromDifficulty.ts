export type DifficultyInfo = {twcss:string, string:string}

function getInfoFromDifficulty(difficulty:number) : DifficultyInfo {
    switch(difficulty){
           case 0:
           return {
               twcss: "text-red-500",
               string:"Very hard"
           }
           case 1:
           return {
               twcss: "text-orange-500",
               string:"Hard"
           }
           
           case 2:
           return {
               twcss: "text-yellow-500",
               string:"Medium"
           }
           case 3:
           return {
               twcss: "text-green-500",
               string:"Easy"
           }
           case 4:
           return {
               twcss: "text-blue-500",
               string:"Very Easy"
           }
           default:
            return {
                twcss: "text-white",
                string:"Unknown"
            }
    }
}

export default getInfoFromDifficulty;