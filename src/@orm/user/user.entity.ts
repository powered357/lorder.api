import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Moment } from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { momentDateTransformer } from '../@columns/moment.date.transformer';
import { Media } from '../media/media.entity';
import { Project } from '../project/project.entity';
import { Role, ROLES } from '../role/role.entity';
import { Task } from '../task/task.entity';
import { UserProject } from '../user-project/user-project.entity';
import { UserWork } from '../user-work/user-work.entity';

@Entity()
export class User {
  static JUST_CREATED = 1;
  static ACTIVATED = 10;

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    length: 254,
    nullable: true,
    transformer: {
      from: d => d,
      to: d => (d ? d.toLowerCase() : undefined),
    },
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column({
    length: 13,
    nullable: true,
    transformer: {
      from: d => d,
      to: d => (d ? d.replace(/[\D]/gi, '') : undefined),
    },
    unique: true,
  })
  tel: string;

  @ApiProperty()
  @Column('int')
  status: number;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  paymentMethod: number;

  @Column({ nullable: true, select: false })
  password: string;

  @ApiProperty({ type: Media })
  @OneToOne(() => Media, { eager: true, nullable: true })
  @JoinColumn()
  avatar?: Media;

  @Column({ nullable: true })
  defaultProjectId: number;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @CreateDateColumn(momentDateTransformer)
  createdAt: Moment;

  @ApiProperty({ example: '2018-05-26T09:05:39.378Z' })
  @UpdateDateColumn(momentDateTransformer)
  updatedAt: Moment;

  @ApiProperty({ type: Role, isArray: true })
  @ManyToMany(() => Role, undefined, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @ApiPropertyOptional()
  @Column({ nullable: true })
  displayName: string;

  @OneToMany(type => Project, project => project.owner)
  ownProjects: Project[];

  @OneToMany(type => UserProject, userProject => userProject.member)
  memberProjects: UserProject[];

  @OneToMany(type => UserProject, userProject => userProject.member)
  invitedMembers: UserProject[];

  @ManyToMany(type => Task, task => task.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'user_tasks' })
  tasks: Task[];

  @OneToMany(type => UserWork, userWork => userWork.user)
  works: UserWork[];

  get role() {
    return { 1: ROLES.USER, 2: ROLES.ADMIN, 3: ROLES.SUPER_ADMIN }[this.roles.length];
  }

  get isSuperAdmin() {
    return this.role === ROLES.SUPER_ADMIN;
  }

  get avatarUrl() {
    return this.avatar ? this.avatar.url : null;
  }

  get publicData(): {
    avatar?: string;
    defaultProjectId: number;
    displayName: string;
    email: string;
    id: number;
    role: ROLES;
  } {
    return {
      avatar: this.avatarUrl,
      defaultProjectId: this.defaultProjectId,
      displayName: this.displayName,
      email: this.email,
      id: this.id,
      role: this.role,
    };
  }
}
