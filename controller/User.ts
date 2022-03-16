import { client, q } from "@fauna";
import { User, UserData } from "@models/User";
import { Job, JobData } from "@models/Job";
import { getJobByRef, getAllJobs } from "./Job";
import {generateNumberFromRange} from "@utils/generateNumberFromRange";
import {CurrentJob, Receiving } from "@models/CurrentJob"
import generateTiming from "@utils/generateTiming";
import { faUserTie, faCoins, faMoneyBill, faGun,faCrown, faBolt, faHeart, faL } from '@fortawesome/free-solid-svg-icons'
import calcJobDifficulty from "@utils/calcJobDifficulty";
import { Enhancement } from "@models/Enhancement";

/**
 * Creates a new User in faunaDB
 * @param user User model object 
 * @returns User model with ref id from fauna
 */
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
        country: user.country,
        attributePoints: user.attributePoints,
        jobs: user.jobs,
        timings: user.timings,
        enhancements: user.enhancements,
        totalAttack: user.totalAttack,
        totalDefence: user.totalDefence,
        totalUpkeep: user.totalUpkeep,
        totalIncome: user.totalIncome,
        regenRateEnergy: user.regenRateEnergy,
        regenRateHealth: user.regenRateHealth,
        regenRateAmmo: user.regenRateAmmo
      },
    })
  );
  user.ref = userRef.ref;
  return user;
};

/**
 * Gets a list of jobs that a user is elligible for
 * @param userRefId user ref id
 * @returns A list of jobData objects
 */
export const getAvailableJobsForUserByRefId = async (userRefId: string): Promise<JobData[]> => {
  const user : User = await getUserByRef(userRefId)
  return await getAvailableJobsForUser(user);
}

/**
 * Gets a list of jobs that a user is elligible for
 * @param user user model object
 * @returns A list of jobData objects
 */
 export const getAvailableJobsForUser = async (user: User): Promise<JobData[]> => {
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

/**
 * Search for a user by name
 * @param name the unique name of the user
 * @returns a UserData object if found, else null
 */
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

/**
 * Search for a user by email
 * @param email the unique email of the user
 * @returns a UserData object if found, else null
 */
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

/**
 * Let a user do a specifc job and update their stats 
 * @param user User model object
 * @param jobRefId ref id of the job
 * @returns The current done job, with stats and rewards 
 * @throws Error if the job is not found
 */
export const userDoesJob = async (user :User, jobRefId: string) : Promise<CurrentJob> => {  
  const jobData : JobData|null = await getJobByRef(jobRefId)
  if(!jobData){
    throw new Error("Job not found")
  }
  const currentJob : CurrentJob= {
    result: false,
    job: jobData,
    timestamp: Date.now()
  }
  const checkLevel = user.level >= jobData.data.minLevel && user.level <= jobData.data.maxLevel
  const checkEnergy = user.energy >= jobData.data.energy;

  if(checkLevel && checkEnergy){
    //User is elligible for job 
    const difficultyPercentage = ( calcJobDifficulty(user.level, jobData.data.minLevel, jobData.data.maxLevel) + 1 ) * 25
    const didJobSuccessfully = generateNumberFromRange(0, 100) < difficultyPercentage

    currentJob.result = didJobSuccessfully
    user.energy -= Number(jobData.data.energy);
    user.lastUpdated = new Date().toISOString();

    if(didJobSuccessfully){
      const experienceGained = Number(jobData.data.experience);
      user.experience += experienceGained
      const dollarsGained = Number(generateNumberFromRange(jobData.data.minDollars, jobData.data.maxDollars));
      currentJob.receivings = [
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
      
    }

    user.timings = {
      ...user.timings,
      energyFull: generateTiming(user.energyMAX - user.energy, user.regenRateEnergy),
    }

    if(!user.jobs)
      user.jobs = [];
      const foundJob = user.jobs.find(job => job.jobRefId === jobRefId)
      if(foundJob){
        user.jobs = user.jobs.map(job => {
          if(job.jobRefId === jobRefId){
            if(didJobSuccessfully){
              job.times += 1;
            }

            let currentRate = -(1/job.times);
            if(didJobSuccessfully){
              currentRate = Math.abs(currentRate)
            }
            job.succesRate = job.succesRate + (currentRate)

            job.lastTimestamp = currentJob.timestamp;
          }
          return job;
        })
    }else{
      user.jobs.push({
        jobRefId,
        times: 1,
        firstTimestamp: Date.now(),
        lastTimestamp: Date.now(),
        succesRate: didJobSuccessfully? 1 : 0
      })
    }

    return currentJob;

  }else{
      return currentJob;
  }

}

/**
 * Update a user to the database
 * @param user user object
 */
export const update = async (user: User) => {
  user = await updateTotals(user);
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
          lastUpdated: Date.now(),
          timings: user.timings,
          enhancements: user.enhancements,
          jobs: user.jobs,
          regenRateAmmo: user.regenRateAmmo,
          regenRateHealth: user.regenRateHealth,
          regenRateEnergy: user.regenRateEnergy,
          totalIncome: user.totalIncome,
          totalUpkeep: user.totalUpkeep,
          totalAttack: user.totalAttack,
          attributePoints: user.attributePoints,
          country: user.country
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

/**
 * Level up a user and update it to the database
 * @param user User object
 */
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

/**
 * Check if a user has the correct energy amount, based on its timing
 * @param user user object
 */
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

/**
 * Deletes a user from the database
 * @param user user object
 */
export const _delete = async (user: User) => {
  await client.query(
    q.Delete(q.Ref(q.Collection("users"), user.getRefId()))
  );
}
/**
 * Deletes a user from the database
 * @param userRefId userRefId from the user
 */
 export const _deleteByRefId = async (userRefId: string) => {
  await client.query(
    q.Delete(q.Ref(q.Collection("users"), userRefId))
  );
}
/**
 * Updates all the total information based on enchancements. It does uploads to the database
 * @param user user object
 * @returns user object with updated values
 */
export const updateTotals = async (user: User) : Promise<User> => {
  let totalIncome = 0;
  let totalUpkeep = 0;
  let totalAttack = 0;
  let totalDefense = 0;

  for await (let enhancement of user.enhancements){
    if(enhancement.amount>0){
      const enhancementObject = await Enhancement.getClassByRefId(enhancement.enhancementRefId);
      console.log(enhancementObject);
      if(enhancementObject){
        totalUpkeep += enhancementObject.upkeep * enhancement.amount;
        totalAttack += enhancementObject.attack * enhancement.amount;
      }
    }
  }
  //TODO update totals with future exorts 

  console.log(totalUpkeep);
  user.totalIncome = totalIncome;
  user.totalUpkeep = totalUpkeep;
  user.totalAttack = totalAttack;
  user.totalDefence = totalDefense;
  return user;
}