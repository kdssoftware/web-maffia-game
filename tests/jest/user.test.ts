
import { User } from '@models/User';

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

