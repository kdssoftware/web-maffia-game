
import { User } from '@models/User';

test('read by ref', async () => {
    const user = await User.getByRef('1646396391200000');
    expect(
        user.name
    ).toBe("test");
})
