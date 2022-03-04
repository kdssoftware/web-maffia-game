import generateCode from "@utils/generateCode";
import { createNewUser, getUserByName, getUserByRef, update, userDoesJob } from "@controller/User";
import {Ref} from "@fauna";

export type UserData =  {
    ref: Ref;
    data: IUser;
}

export interface IUser {
    level : number;
    dollars: number;
    energy: number;
    energyMAX: number;
    chips: number;
    health: number;
    healthMax: number;
    experience: number;
    experienceMax: number;
    ammo: number;
    ammoMax: number;
    name: string;
    code: string;
    country:string;
    lastUpdated: string;
    attributePoints: number;
    jobs: {
        jobRefId: string;
        times: number;
      }[];
    ref: Ref;
}

class User implements IUser {
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
    jobs!: {
        jobRefId: string;
        times: number;
      }[];
    ref!:Ref
    
    constructor(name:string){
        this.name = name;
    }

    //if not exists create a new user, else return the existing user
    get = async () =>{
        await getUserByName(this.name).then(async userData => {
            if(userData){
                this.ref = userData.ref;
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
                await createNewUser(this).then(user => {
                    this.ref = user.ref;
                })
            }
        })
    }

    public doJob = async (jobRefId : string) => {
        if(this.ref){
            const jobDone = await userDoesJob(this, jobRefId);
            if(jobDone){
                console.log("Job done");
                await update(this);
                return true;
            }else{
                return false;
            }
        }
    }

    public static async getByRef(refId:string) {
        return await getUserByRef(refId);
    }

    public getRefId() {
        //@ts-ignore
        return Object.values(this.ref)[0].id
    }
    
}

export { User};