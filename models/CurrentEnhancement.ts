import type { EnhancementType } from "@models/Enhancement"
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
    amountBought:number;
    ref:Ref;
}