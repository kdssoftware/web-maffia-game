import {generateCode, validateUsername} from "@utils/stringFunctions";
import { createNewUser, getUserByEmail, getUserByRef, update, userDoesJob,getAvailableJobsForUserByRefId,  getAvailableJobsForUser} from "@controller/User";
import {Ref} from "@fauna";

export type UserData =  {
    ref: Ref;
    data: IUser;
}

export type UserRole = "admin" | "user";

export interface IUser {
    email: string; //Email address\
    role: UserRole; // user or admin
    level : number; //Level of the user, starts with 1. does not have a limit
    dollars: number; // Amount of money the user has
    energy: number; // Amount of energy the user has, cannot be negative
    energyMAX: number; // Max amount of energy the user can have, starts with 100
    chips: number; // Amount of chips the user has
    health: number; //  Amount of health the user has, cannot be negative
    healthMax: number; // Amount of health the user can have, starts with 200
    experience: number; // Amount of experience the user has, cannot be negative
    experienceMax: number; // Amount of experience the user can have, starts with 10
    ammo: number; // Amount of ammo the user has, cannot be negative
    ammoMax: number; // Amount of ammo the user can have, starts with 10
    name: string; // Name of the user
    code: string; // Code for the user, unique and generated automatically at signup
    country:string; // Country of the user, ISO with 2 chars
    lastUpdated: string; // Last time the user was updated
    attributePoints: number; // Amount of attribute points the user has
    totalAttack: number; // Total amount of attack the user has, calculated from enhancements
    totalDefence: number; // Total amount of defence the user has, calculated from enhancements
    totalUpkeep: number; // Total amount of upkeep the user has, calculated from enhancements
    totalIncome: number; // Total amount of income the user has, calculated from exorts
    regenRateEnergy: number; // Rate of energy regeneration, default 5 min
    regenRateHealth: number; // Rate of health regeneration, default 1 min
    regenRateAmmo: number;  // Rate of ammo regeneration, default 5 min
    jobs: { // list of jobs the user has done
        jobRefId: string; // refId of the job
        times: number; // amount of times the user has done the job
        succesRate: number; // success rate of the job, in float percentage (0 => 0%, 1 => 100%)
        firstTimestamp: number; // timestamp of the first time the user has done the job
        lastTimestamp: number; // timestamp of the last time the user has done the job
      }[];
    enhancements:{ // list of enhancements the user has
        enhancementRefId: string; // refId of the enhancement
        amount: number; // amount of the enhancement
        firstTimeStamp: number; // timestamp of the first time the user has bought the enhancement
        lastTimeStamp: number; // timestamp of the last time the user has bought the enhancement
    }[]
    timings:{ // list of timings the user has in ms. if null, meaning at full.
        energyFull: number | null; // timestamp when the energy is full, calculated from regenRateEnergy
        ammoFull: number | null; // timestamp when the ammo is full, calculated from regenRateAmmo
        healthFull: number | null; // timestamp when the health is full, calculated from regenRateHealth
    }
    ref: Ref; // faunea refId of the user
}

class User implements IUser {
    email: string;
    role!:UserRole;
    level!: number;
    dollars!: number;
    energy!: number;
    energyMAX!: number;
    chips!: number;
    health!: number;
    healthMax!: number;
    experience!: number;
    experienceMax!: number;
    ammo!: number;
    ammoMax!: number;
    name!: string;
    code!: string;
    country!:string;
    lastUpdated!: string;
    attributePoints!: number;
    totalAttack!: number;
    totalDefence!: number;
    totalUpkeep!: number;
    totalIncome!: number;
    regenRateEnergy!: number;
    regenRateHealth!: number;
    regenRateAmmo!: number;
    jobs!: {
        jobRefId: string;
        times: number;
        succesRate: number;
        firstTimestamp: number;
        lastTimestamp: number;
      }[];
    enhancements!: {
        enhancementRefId: string; 
        amount: number; 
        firstTimeStamp: number;
        lastTimeStamp: number;
    }[];
    timings!:{
        energyFull: number | null;
        ammoFull: number | null;
        healthFull: number | null;
    }
    ref!:Ref
    
    constructor(name:string, email:string) {
        this.name = name;
        this.email = email;
    }


    //if not exists create a new user, else return the existing user
    get = async () =>{
        await getUserByEmail(this.email).then(async userData => {
            if(userData){
                this.ref = userData.ref;
                this.role = userData.data.role;
                this.level = userData.data.level;
                this.dollars = userData.data.dollars;
                this.energy = userData.data.energy;
                this.energyMAX = userData.data.energyMAX;
                this.chips = userData.data.chips;
                this.health = userData.data.health;
                this.healthMax = userData.data.healthMax;
                this.experience = userData.data.experience;
                this.experienceMax = userData.data.experienceMax;
                this.ammo = userData.data.ammo;
                this.ammoMax = userData.data.ammoMax;
                this.name = userData.data.name;
                this.code = userData.data.code;
                this.country = userData.data.country;
                this.lastUpdated = userData.data.lastUpdated;
                this.attributePoints = userData.data.attributePoints;
                this.jobs = userData.data.jobs;
                this.timings = userData.data.timings;
                this.enhancements = userData.data.enhancements;
                this.totalAttack = userData.data.totalAttack;
                this.totalDefence = userData.data.totalDefence;
                this.totalUpkeep = userData.data.totalUpkeep;
                this.totalIncome = userData.data.totalIncome;
                this.regenRateEnergy = userData.data.regenRateEnergy;
                this.regenRateHealth = userData.data.regenRateHealth;
                this.regenRateAmmo = userData.data.regenRateAmmo;
            }else{
                this.level = 1;
                this.dollars = 2000;
                this.energy = 20;
                this.energyMAX = 20;
                this.chips = 10;
                this.health = 100;
                this.healthMax = 100;
                this.experience = 0;
                this.experienceMax = 10;
                this.ammo = 5;
                this.ammoMax = 5;
                this.country = "US";
                this.code = generateCode(); 
                this.attributePoints = 0;
                this.lastUpdated = (new Date()).toISOString();
                this.jobs = []
                this.timings = {
                    energyFull: null,
                    ammoFull: null,
                    healthFull: null
                }
                this.totalAttack = 0;
                this.totalDefence = 0;
                this.totalUpkeep = 0;
                this.totalIncome = 0;
                this.regenRateEnergy = 5;
                this.regenRateHealth = 1;
                this.regenRateAmmo = 5;
                this.role = "user";
                await createNewUser(this).then(user => {
                    this.ref = user.ref;
                })
            }
        })
    }

    public doJob = async (jobRefId : string) => {
        if(this.ref){
            const jobDone = await userDoesJob(this, jobRefId);
            if(jobDone.result===true){
                await update(this);
                return jobDone;
            }else{
                return jobDone;
            }
        }
    }

    public getAmountOfSpecificEnhancement = (enhancementRefId: string) :number => {
        if(!this){
            throw "No object found, use static method"
        }
        if(!this.enhancements){
            return 0;
        }
        return this.enhancements.find(enhancement => enhancement.enhancementRefId === enhancementRefId)?.amount??0;
    }

    public static  getAmountOfSpecificEnhancementStatic =async (enhancementRefId: string, userRefId: string) => {
        let userObj = await User.getByRef(userRefId)
        return userObj.getAmountOfSpecificEnhancement(enhancementRefId);
    }

    public static  getByRef = async (refId:string) => {
        return await getUserByRef(refId);
    }

    public getRefId = () => {
        //@ts-ignore
        return Object.values(this.ref)[0].id
    }

    public static getRefIdStatic = (user:User)=> {
        //@ts-ignore
        return Object.values(user.ref)[0].id
    }

    public  getAvailableJobs = async () =>{
        return await getAvailableJobsForUser(this);
    }

    public  static  getAvailableJobsStatic = async (userRefId: string) => {
        return await getAvailableJobsForUserByRefId(userRefId);
    }
    public changeUsername = async (username : string) : Promise<boolean> => {
        if(!this){
            throw "No object found, use User as object"
        }
        if(!validateUsername(username)){
            return false;
        }
        if(this.name === username){
            return true;
        }
        this.name = username;
        try{
            await update(this);
            return true;
        }catch(e){
            return false;
        }
    }
    
}

export { User };