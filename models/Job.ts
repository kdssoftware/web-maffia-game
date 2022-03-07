import { createNewJob, getJob } from "@controller/Job";
import {Ref} from "@fauna";
import { getJobByName } from "@controller/Job";

export type JobData = {
    ref: Ref;
    data: IJob;
}

export interface IJob {
    name: string;
    description: string;
    minLevel: number;
    maxLevel: number;
    minDollars: number;
    maxDollars: number;
    energy: number;
    experience: number;
    ref:Ref;
}

export class Job implements IJob {
    name: string;
    description!: string;
    minLevel!: number;
    maxLevel!: number;
    minDollars!: number;
    maxDollars!: number;
    energy!: number;
    experience!: number;
    ref!: Ref;

    constructor(
        name :string, description? : string, minLevel? : number,
        maxLevel? : number, minDollars? :number, maxDollars? : number, 
        energy? :number, experience? : number)
        {
        this.name = name;
        if(description) this.description = description;
        if(minLevel) this.minLevel = minLevel;
        if(maxLevel) this.maxLevel = maxLevel;
        if(minDollars) this.minDollars = minDollars;
        if(maxDollars) this.maxDollars = maxDollars;
        if(energy) this.energy = energy;
        if(experience) this.experience = experience;
    }

    get = async () => {
        await getJobByName(this.name).then(async (job) => {
            if(job) {
                this.description = job.data.description;
                this.minLevel = job.data.minLevel;
                this.maxLevel = job.data.maxLevel;
                this.minDollars = job.data.minDollars;
                this.maxDollars = job.data.maxDollars;
                this.energy = job.data.energy;
                this.experience = job.data.experience;
                this.ref = job.ref;
            }else{
                await createNewJob(this).then(job => {
                    this.ref = job.ref;
                })
            }
        })
    }

    static async getByRef(refId:string) : Promise<Job> {
        return await getJob(refId);
    }

    public getRefId() : string {
        //@ts-ignore
        return String(Object.values(this.ref)[0].id)
    }

    public static getRefIdFromJobDataStatic(jobData:JobData) : string {
        //@ts-ignore
        return Object.values(jobData.ref)[0].id
    }

}