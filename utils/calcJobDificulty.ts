// 0 = very hard
// 1 = hard
// 2 = medium
// 3 = easy
// 4 = very easy

const calcJobDifficulty = (userLevel : number, jobMinLevel : number, jobMaxLevel :number): number => {
    const jobPer = jobMinLevel / jobMaxLevel;
    const userInRetroScale = userLevel * jobPer;
    return Math.round(userInRetroScale / 0.25);
}


export default calcJobDifficulty