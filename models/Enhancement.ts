import { getEnhancementByName, purchase, getEnhancementByRef } from "@controller/Enhancement";
import {Ref} from "@fauna";

export interface IEnhancement {
    type:EnhancementType;
    name:string;
    attack:number;
    defence:number;
    cost:number;
    minLevel:number;
    upkeep:number;
    ref:Ref;
}

export enum EnhancementType {
    equipment = "equipment",
    characteristic = "characteristic",
    car = "car",
}

export type EnhancementData = {
    ref: Ref;
    data: IEnhancement;
}

export class Enhancement implements IEnhancement {
    name: string;
    type!: EnhancementType;
    attack!: number;
    defence!: number;
    cost!: number;
    minLevel!: number;
    upkeep!: number;
    ref!: Ref;
    
    constructor(name:string){
        this.name = name;
    }

    public get = async () =>  {
        await getEnhancementByName(this.name).then(enhancementData => {
            if(enhancementData){
                this.type = enhancementData.data.type;
                this.attack = enhancementData.data.attack;
                this.defence = enhancementData.data.defence;
                this.cost = enhancementData.data.cost;
                this.minLevel = enhancementData.data.minLevel;
                this.upkeep = enhancementData.data.upkeep;
                this.ref = enhancementData.ref;
            }else{
                throw new Error("Enhancement not found");
            }
        })
    }
    public static getRefIdFromEnhancementDataStatic(enhancementData:EnhancementData) : string {
        //@ts-ignore
        return Object.values(enhancementData.ref)[0].id
    }

    public static async getClassByRefId(refId : string) : Promise<Enhancement>{
        return await getEnhancementByRef(refId);
    } 

    public getRefId() : string {
        //@ts-ignore
        return String(Object.values(this.ref)[0].id)
    }

    public async purchase(userRefId :  string, amount:number = 1){
        return await purchase(userRefId, this.getRefId(), amount);
    }
}