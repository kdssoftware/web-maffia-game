import { client, q } from "@fauna";
import { Job, JobData } from "@models/Job";

/**
 * uploads the job object to faunadb, giving it a ref id
 * @param job a job object
 * @returns the job object, with fauna db ref id
 */
export const createNewJob = async (job: Job): Promise<Job> => {
  const jobRef: JobData = await client.query(
    q.Create(q.Collection("jobs"), {
      data: {
        name: job.name,
        description: job.description,
        minLevel: job.minLevel,
        maxLevel: job.maxLevel,
        minDollars: job.minDollars,
        maxDollars: job.maxDollars,
        energy: job.energy,
        experience: job.experience,
        lastUpdated: Date.now(),
      },
    })
  );
  job.ref = jobRef.ref;
  return job;
};

/**
 * Get an array of all jobs in the database
 * @returns An array of jobs
 */
export const getAllJobs = async () : Promise<JobData[]> => {
  const jobs : {data: JobData[]} = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("jobs_all"))),
      q.Lambda("job", q.Get(q.Var("job")))
    )
  );
  return jobs.data;
}

/**
 * Get a job by its ref id
 * @param refId the id from fauna db
 * @returns A job object or null if not found
 */
export const getJob = async (refId: string): Promise<Job|null> => {
  try{
    const jobData: JobData = await client.query(
      q.Get(q.Ref(q.Collection("jobs"), refId))
    );
    const job: Job = new Job(
      jobData.data.name,
      jobData.data.description,
      jobData.data.minLevel,
      jobData.data.maxLevel,
      jobData.data.minDollars,
      jobData.data.maxDollars,
      jobData.data.energy,
      jobData.data.experience
    );
    job.ref = jobData.ref;
    return job;
  }catch(e){
    return null;
  }
};

/**
 * Get a job by its name
 * @param name a string with the name of the job
 * @returns a job object or null if not found.
 */
export const getJobByName = async (name: string): Promise<JobData|null> => {
    try{
        const jobData: JobData = await client.query(
            q.Get(q.Match(q.Index("jobs_by_name"), name))
          );
          return jobData;
    }catch(e){
        return null;
    }
};

/**
 * Get jobData from a ref id 
 * @param refId the ref id from fauna db
 * @returns a jobData object or null if not found
 */
export const getJobByRef = async (refId: string): Promise<JobData|null> => {
  try{
    const jobData: JobData = await client.query(
      q.Get(q.Ref(q.Collection("jobs"), refId))
    );
    return jobData;
  }catch(e){
    return null;
  }
};

/**
 * Delete a job by given job object from the database
 * @param job job object
 */
export const _delete = async (job: Job) => {
  await client.query(
    q.Delete(q.Ref(q.Collection("jobs"), job.getRefId()))
  );
}

export const _deleteByRefId= async (jobRefId: string) => {
  await client.query(
    q.Delete(q.Ref(q.Collection("jobs"), jobRefId))
  );
}