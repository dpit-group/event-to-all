import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { mapCreateUserDtoToEntity } from './mappers/user.mapper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = mapCreateUserDtoToEntity(createUserDto);

    return user.save();
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        where: {
          email: email,
        },
      })
      .catch((error) => {
        console.log('User not found email:');
        return null;
      });
  }
}
