import { STATUS_NAME } from '../../../../@domains/strategy';
import { ROLES } from '../../../../@orm/role';
import { ACCESS_LEVEL } from '../../../../@orm/user-project';
import {
  createProjects,
  createTasks,
  createUserProjects,
  createUsers,
} from '../../../../@test-helper/@fixtureCreators';

export const usersFixture = createUsers([
  {
    email: 'project-owner@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'not-owner@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'member@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'not-member@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'access-level-white@mail.com',
    roles: [{ name: ROLES.USER }],
  },
]);

export const projectsFixture = createProjects([
  {
    owner: { email: 'project-owner@mail.com' },
  },
]);

export const userProjectsFixture = createUserProjects([
  {
    accessLevel: ACCESS_LEVEL.VIOLET,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'project-owner@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.INDIGO,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'not-owner@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.RED,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'member@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.WHITE,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'access-level-white@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
]);

export const tasksFixture = createTasks([
  {
    performer: { email: 'member@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
    title: 'task1',
    userTasks: [{ user: { email: 'member@mail.com' } }],
  },
  {
    performer: { email: 'project-owner@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
    title: 'performer IS NOT current user',
    userTasks: [{ user: { email: 'member@mail.com' } }],
  },
  {
    isArchived: true,
    performer: { email: 'member@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
    title: 'archived task',
    userTasks: [{ user: { email: 'member@mail.com' } }],
  },
  {
    performer: { email: 'member@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
    statusTypeName: STATUS_NAME.DONE,
    title: 'finished task',
    userTasks: [{ user: { email: 'member@mail.com' } }],
  },
]);
