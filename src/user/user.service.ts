import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  public async findOne(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneOrFail(id);
  }

  public async findOneByIdentifier(identifier: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ identifier });
  }

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    user.status = 1;
    return await this.userRepository.save(user);
  }
}
