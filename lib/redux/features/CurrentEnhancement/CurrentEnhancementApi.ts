import { CurrentEnhancement } from '@models/CurrentEnhancement';
import {CurrentJob} from '@models/CurrentJob';

export async function fetchPurchase(enhancementRefId:string, amount:number): Promise<CurrentEnhancement> {
    const response = await fetch('/api/enhancement/purchase?id='+enhancementRefId+'&amount='+amount)
    const currentEnhancement = await response.json()
    return currentEnhancement
  } 