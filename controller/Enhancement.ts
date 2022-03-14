import { Enhancement, EnhancementData, EnhancementType } from "@models/Enhancement";
import { client, q } from "@fauna";

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