export type DifficultyInfo = {twcss:string, string:string, difficulty:number, difficultyPercentage:number}
/**
 * Generate difficulty info object based on the difficulty of a job. zie @utils\calcJobDifficulty.ts
 * @param difficulty the dificulty of the job, from 0 to 4. (0 => very hard, 1 => hard, 2 => medium, 3 => easy, 4 => very easy)
 * @returns a difficulty info object, with the following properties:
 * twcss: the tailwindcss class for the difficulty, e.g. "text-red-500"
 * string: the string for the difficulty, e.g. "Very Hard"
 * difficulty: the difficulty number that was given, e.g. 0
 * difficultyPercentage: the percentage of the difficulty, e.g. 25 (25% of the time it will succeed)
 */
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