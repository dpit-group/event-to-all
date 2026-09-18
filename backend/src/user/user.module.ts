import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [SequelizeModule.forFeature([User])],
})
export class UserModule {}
