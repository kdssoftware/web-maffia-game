export type DifficultyInfo = {twcss:string, string:string, difficulty:number, difficultyPercentage:number}

function getInfoFromDifficulty(difficulty:number) : DifficultyInfo {
    switch(difficulty){
           case 0:
           return {
               twcss: "text-red-500",
               string:"Very hard",
               difficulty:difficulty,
               difficultyPercentage:(difficulty+1)*25
           }
           case 1:
           return {
               twcss: "text-orange-500",
               string:"Hard",
               difficulty:difficulty,
               difficultyPercentage:(difficulty+1)*25
           }
           
           case 2:
           return {
               twcss: "text-yellow-500",
               string:"Medium",
               difficulty:difficulty,
               difficultyPercentage:(difficulty+1)*25
           }
           case 3:
           return {
               twcss: "text-green-500",
               string:"Easy",
               difficulty:difficulty,
               difficultyPercentage:(difficulty+1)*25
           }
           case 4:
           return {
               twcss: "text-blue-500",
               string:"Very Easy",
               difficulty:difficulty,
               difficultyPercentage:100
           }
           default:
            return {
                twcss: "text-white",
                string:"Unknown",
                difficulty:difficulty,
                difficultyPercentage:difficulty*25
            }
    }
}

export default getInfoFromDifficulty;