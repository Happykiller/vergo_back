import { USER_ROLE } from '@presentation/guard/userRole';
import { UserDbModel } from '@service/db/model/user.db.model';

export const userRopo: UserDbModel = {
  id: '65d4d015261e894a1da31a64',
  code: 'ropo',
  password:
    'B5DicCkBcu6twsf95mosv5wfjrR9YeCBl/v26tHQDwQB1fwoNjzipo51R8+IuCUQ7yijXFSzktxaSR3+9LXqyA==',
  name_first: 'Robert',
  name_last: 'Paulson',
  description: 'password with secret secretKey',
  mail: 'r.paulson@bob.com',
  role: USER_ROLE.ADMIN,
  active: true,
};
