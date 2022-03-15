import type { Enhancement, EnhancementType } from "./Enhancement"
import {Ref} from "@fauna";

export type CurrentEnhancement = {
    type:EnhancementType,
    name:string;
    attack:number;
    defence:number;
    cost:number;
    minLevel:number;
    upkeep:number;
    success:boolean;
    ref:Ref;
}