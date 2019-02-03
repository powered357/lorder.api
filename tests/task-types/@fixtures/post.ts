import { ROLES } from '../../../src/@orm/role';
import { createTaskTypes, createUsers } from '../../@fixtureCreators';

export const usersFixture = createUsers([
  {
    email: 'user@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'admin@mail.com',
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }],
  },
  {
    email: 'super-admin@mail.com',
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }, { name: ROLES.SUPER_ADMIN }],
  },
]);

export const taskTypesFixtures = createTaskTypes([
  {
    title: 'Already exists',
  },
]);
