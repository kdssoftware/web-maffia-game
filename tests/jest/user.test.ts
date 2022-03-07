
import { User } from '@models/User';

test('create new local user',async () => {

})

test('push local user to db',async ()=>{

})

test('user does job correctly', async () => {

})

test('user cant do job because not enough resources', async () => {
    
})

test('get by ref gives correct user', async () => {
    const user = await User.getByRef('1646396391200000');
    expect(
        user.name
    ).toBe("test");
})

test('create user with name locally works', async () =>{
    const user = new User('test');
    expect(user.name).toBe('test');
})

test('create user locally and push to database', async () =>{
    const user = new User('test123');
    await user.get();
    expect(user.ref).toBeDefined();
})

