import {User} from '@models/User';

export async function fetchUser(userRefId:string): Promise<User> {
    const response = await fetch('/api/user/getByRefId?id='+userRefId)
    const result = await response.json()
    return result
  }