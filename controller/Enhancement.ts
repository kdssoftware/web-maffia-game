import { Enhancement, EnhancementData, EnhancementType } from "@models/Enhancement";
import { client, q } from "@fauna";
import {getUserByRef, update as updateUser} from "@controller/User";
import {User} from "@models/User";
import { CurrentEnhancement } from "@models/CurrentEnhancement";

export const getEnhancementByRef = async (enhancementRefId: string): Promise<Enhancement> => {
    const enhancementData: EnhancementData = await client.query(
      q.Get(q.Ref(q.Collection("enhancement"), enhancementRefId))
    );
    const enhancement : Enhancement = new Enhancement(
        enhancementData.data.name
    )
    await enhancement.get();
    return enhancement
  };

export const getEnhancementByName = async (name: string): Promise<EnhancementData | null> => {
    try {
      const enhancementData: EnhancementData = await client.query(
        q.Get(q.Match(q.Index("enhancement_by_name"), name))
      );
      return enhancementData;
    } catch (e) {
      return null;
    }
  };
  export const getAllEnhancements = async (): Promise<EnhancementData[]| null> => {
    const enhancements : {data: EnhancementData[]} = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("enhancements_all"))),
          q.Lambda("enhancement", q.Get(q.Var("enhancement")))
        )
      );
      return enhancements.data;
  };

export const getEnhancementsByType = async (type: EnhancementType): Promise<EnhancementData[] | null> => {
    try {
      const enhancementData: {data: EnhancementData[]} = await client.query(
        q.Get(q.Match(q.Index("enhancement_by_type"), type))
      );
      return enhancementData.data;
    } catch (e) {
      return null;
    }
  };

export const purchase = async (userRefId: string, enhancementRefId: string, amount:number=1) : Promise<CurrentEnhancement> => {
  const enhancement = await getEnhancementByRef(enhancementRefId);
  let currentEnhancement = {
    type: enhancement.type,
    name: enhancement.name,
    attack: enhancement.attack,
    defence: enhancement.defence,
    cost: enhancement.cost,
    minLevel: enhancement.minLevel,
    upkeep: enhancement.upkeep,
    success:false,
    amountBought:amount,
    ref: enhancement.ref
  }
  const user = await getUserByRef(userRefId);
  if(user && enhancement){
    const hasEnoughMoney = user.dollars >= (enhancement.cost * amount);
    const hasEnoughLevel = user.level >= enhancement.minLevel;
    if(hasEnoughMoney && hasEnoughLevel){
      user.dollars -= (enhancement.cost * amount);
      if(!user.enhancements){
        user.enhancements = [{
          enhancementRefId:enhancementRefId, 
          amount:amount
        }]
      }else{
        const enhancementFound = user.enhancements.find(enh => enh.enhancementRefId === enhancementRefId);
        if(enhancementFound){
          user.enhancements = user.enhancements.map(enh => {
            if(enh.enhancementRefId == enhancementRefId){
              enh.amount += amount;
            }
            return enh;
          })
        }else{
          user.enhancements.push({
            enhancementRefId: enhancementRefId,
            amount: amount
          })
        }
      }
      await updateUser(user);
      currentEnhancement.success = true;
      return currentEnhancement
    }else{
      return currentEnhancement
    }
  }
  return currentEnhancement
}