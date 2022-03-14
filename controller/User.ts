import { client, q } from "@fauna";
import { User, UserData } from "@models/User";
import { Job, JobData } from "@models/Job";
import { getJobByRef, getAllJobs } from "./Job";
import {generateNumberFromRange} from "@utils/generateNumberFromRange";
import {CurrentJob, Receiving } from "@models/CurrentJob"
import generateTiming from "@utils/generateTiming";
import { faUserTie, faCoins, faMoneyBill, faGun,faCrown, faBolt, faHeart, faL } from '@fortawesome/free-solid-svg-icons'
import calcJobDifficulty from "@utils/calcJobDifficulty";

export const createNewUser = async (user: User): Promise<User> => {
  const userRef: UserData = await client.query(
    q.Create(q.Collection("users"), {
      data: {
        email: user.email,
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

export const getAvailableJobsForUser = async (userRefId: string): Promise<JobData[]> => {
  const user : User = await getUserByRef(userRefId)
  const jobs: JobData[] = Array.from(await getAllJobs());
  return jobs.filter(job => {
    if(user.level >= job.data.minLevel && user.level <= job.data.maxLevel){
      return true
    }
  })
}

export const getUserByRef = async (userRef: string): Promise<User> => {
  const userData: UserData = await client.query(
    q.Get(q.Ref(q.Collection("users"), userRef))
  );
  const user : User = new User(
    userData.data.name,
    userData.data.email
  
  )
  await user.get();

  return user
};

export const getUserByName = async (name: string): Promise<UserData | null> => {
  try {
    const userData: UserData = await client.query(
      q.Get(q.Match(q.Index("users_by_name"), name))
    );
    return userData;
  } catch (e) {
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const userData: UserData = await client.query(
      q.Get(q.Match(q.Index("users_by_email"), email))
    );
    return userData;
  } catch (e) {
    return null;
  }
};

export const userDoesJob = async (user :User, jobRefId: string) : Promise<CurrentJob> => {  
  const jobData : JobData = await getJobByRef(jobRefId)
  const currentJob : CurrentJob= {
    result: false,
    job: jobData
  }
  const checkLevel = user.level >= jobData.data.minLevel && user.level <= jobData.data.maxLevel
  const checkEnergy = user.energy >= jobData.data.energy;
  const difficultyPercentage = ( calcJobDifficulty(user.level, jobData.data.minLevel, jobData.data.maxLevel) + 1 ) * 25
  const randomPercentage = generateNumberFromRange(0, 100)
  const checkSucceededByDifficulty = randomPercentage < difficultyPercentage
  if(checkLevel && checkEnergy && checkSucceededByDifficulty){
    user.energy -= Number(jobData.data.energy);
    const experienceGained = Number(jobData.data.experience);
    user.experience += experienceGained
    user.lastUpdated = new Date().toISOString();
    const dollarsGained = Number(generateNumberFromRange(jobData.data.minDollars, jobData.data.maxDollars));
    const receivings : Receiving[] = [
      {
        icon: faMoneyBill,
        value: ('$' + dollarsGained),
        color: 'text-green-500'
      },
      {
          icon: faCrown,
          value:("Experience +" + experienceGained),
          color:"text-default"
      }
    ]
    user.dollars += dollarsGained;
    user.timings = {
      ...user.timings,
      energyFull: generateTiming(user.energyMAX - user.energy, 5),
    }

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
    currentJob.result= true
    currentJob.receivings = receivings;
    return currentJob;

  }else{
      return currentJob;
  }

}

export const update = async (user: User) => {
  try{
    await client.query(
      q.Update(q.Ref(q.Collection("users"), user.getRefId()), {
        data: {
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
          lastUpdated: new Date().toISOString(),
          timings: user.timings,
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
  user.timings.ammoFull = null;
  user.timings.energyFull = null;
  user.timings.healthFull = null;
  await update(user); 
}

export const updateEnergyBasedOnTiming = async (user:User) => {
  if(user.timings.energyFull){
    const now = Date.now()
    const diff = user.timings.energyFull - now;
    const energyCurrent = user.energy 
    const energyMax = user.energyMAX
    const energyDiff = energyMax - energyCurrent
    console.log(energyDiff);
    if(diff > 0){
      const energyTiming = 5 * 1000 * 60 // 5 min in ms
      const energyToAdd = Math.abs(Math.ceil(diff /energyTiming)-energyDiff)
      console.log("Adding "+energyToAdd+" energy", diff, energyDiff);
      if(energyMax===energyCurrent){
        user.timings.energyFull = null;
      }
      if(energyToAdd >= 0){
        user.energy += energyToAdd
        await update(user);
      }
    }else if (diff < 0 || user.timings.energyFull){
      user.energy = energyMax
      user.timings.energyFull = null
      await update(user);
    }
  }
}


export const _delete = async (user: User) => {
  await client.query(
    q.Delete(q.Ref(q.Collection("users"), user.getRefId()))
  );
}
