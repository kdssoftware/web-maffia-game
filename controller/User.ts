import { client, q } from "@fauna";
import { User, UserData } from "@models/User";
import { getJobByRef } from "./Job";
import {generateNumberFromRange} from "@utils/generateNumberFromRange";

export const createNewUser = async (user: User): Promise<User> => {
  const userRef: UserData = await client.query(
    q.Create(q.Collection("users"), {
      data: {
        name: user.name,
        level: user.level,
        dollars: user.dollars,
        energy: user.energy,
        energyMAX: user.energyMAX,
        chips: user.chips,
        health: user.health,
        healthMax: user.healthMax,
        experience: user.experience,
        experienceMax: user.experienceMax,
        ammo: user.ammo,
        ammoMax: user.ammoMax,
        code: user.code,
        lastUpdated: user.lastUpdated,
      },
    })
  );
  user.ref = userRef.ref;
  return user;
};

export const getUserByRef = async (userRef: string): Promise<User> => {
  const userData: UserData = await client.query(
    q.Get(q.Ref(q.Collection("users"), userRef))
  );
  const user : User = new User(
    userData.data.name
  )
  await user.get();

  return user
};

export const getUserByName = async (name: string): Promise<UserData | null> => {
  try {
    const userData: UserData = await client.query(
      q.Get(q.Match(q.Index("users_by_name"), name))
    );
    console.log(userData);
    return userData;
  } catch (e) {
    console.log(e)
    return null;
  }
};

export const userDoesJob = async (user :User, jobRefId: string) => {  
  /**
   * 1. Get job data
   * 2. check if enough demaning resources
   * 3. update user data
   */
  const jobData = await getJobByRef(jobRefId)
  const checkLevel = user.level >= jobData.data.minLevel && user.level <= jobData.data.maxLevel
  const checkEnergy = user.energy >= jobData.data.energy;
  if(checkLevel && checkEnergy){
    user.energy -= Number(jobData.data.energy);
    user.experience += Number(jobData.data.experience);
    user.lastUpdated = new Date().toISOString();
    const dollars = Number(generateNumberFromRange(jobData.data.minDollars, jobData.data.maxDollars));
    user.dollars += dollars;
    if(!user.jobs)
      user.jobs = [];
    const foundJob = user.jobs.find(job => job.jobRefId === jobRefId)
    if(foundJob){
      user.jobs = user.jobs.map(job => {
        if(job.jobRefId === jobRefId){
          job.times += 1;
        }
        return job;
      })
    }else{
      user.jobs.push({
        jobRefId,
        times: 1
      })
    }
    return true;
  }else{
      return false;
  }

}

export const update = async (user: User) => {
  try{
    await client.query(
      q.Update(q.Ref(q.Collection("users"), user.getRefId()), {
        data: {
          name: user.name,
          level: user.level,
          dollars: user.dollars,
          energy: user.energy,
          energyMAX: user.energyMAX,
          chips: user.chips,
          health: user.health,
          healthMax: user.healthMax,
          experience: user.experience,
          experienceMax: user.experienceMax,
          ammo: user.ammo,
          ammoMax: user.ammoMax,
          code: user.code,
          lastUpdated: user.lastUpdated,
          jobs: user.jobs,
        },
      })
    );
  }catch(e){
    console.log(e);
    throw e;
  }
  if(user.experience >= user.experienceMax){
    await levelUp(user)
  }
}

export const levelUp = async (user: User) => {
  user.level += 1;
  user.energyMAX += 10;
  user.energy = user.energyMAX;
  user.healthMax += 10;
  user.health = user.healthMax;
  user.experience = 0;
  user.experienceMax += 10;
  await update(user);
}