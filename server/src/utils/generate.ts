import { User } from '../models/user.model';
import { createUser, findUserById } from '../services/user.service';
import log from './logger';

export async function generateAdmin() {
  try {
    const user = await findUserById(1);
    if (user) return;
    else await createUser(dataAdmin());
  } catch (error: any) {
    const e = error as Error;
    log.error(`generateAdmin: ${e.message}`);
    process.exit(1);
  }
}

function dataAdmin() {
  return new User({
    email: 'test@t.com',
    password: '123456',
    firstname: 'Admin',
    lastname: 'Admin',
    role: 'admin',
    active: true,
    remark: '',
  });
}
