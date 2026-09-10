import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';

export function mapCreateUserDtoToEntity(
  createUserDto: CreateUserDto,
): User {
  return new User({
    name: createUserDto.name,
    username: createUserDto.username,
    phoneNumber: createUserDto.phoneNumber,
    email: createUserDto.email,
    password: createUserDto.password,
    isBusinessAccount: createUserDto.isBusinessAccount,
  });
}

export function mapUserToResponse(user: User): UserResponseDto {
  const { password: _password, ...response } = user;
  return response;
}