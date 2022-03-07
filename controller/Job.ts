import { client, q } from "@fauna";
import { Job, JobData } from "@models/Job";

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
      },
    })
  );
  job.ref = jobRef.ref;
  return job;
};

export const getAllJobs = async () : Promise<JobData[]> => {
  const jobs : {data: JobData[]} = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("jobs_all"))),
      q.Lambda("job", q.Get(q.Var("job")))
    )
  );
  return jobs.data;
}

export const getJob = async (refId: string): Promise<Job> => {
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
};

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

export const getJobByRef = async (refId: string): Promise<JobData> => {
  const jobData: JobData = await client.query(
    q.Get(q.Ref(q.Collection("jobs"), refId))
  );
  return jobData;
};

export const _delete = async (job: Job) => {
  await client.query(
    q.Delete(q.Ref(q.Collection("jobs"), job.getRefId()))
  );
}