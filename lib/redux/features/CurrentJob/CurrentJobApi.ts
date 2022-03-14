import {CurrentJob} from '@models/CurrentJob';

export async function fetchDoJob(jobRefId:string): Promise<CurrentJob> {
    const response = await fetch('/api/job/do?id='+jobRefId)
    const result = await response.json()
    return result
  } 