import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRepository } from './user.repository';
import { mapUserToResponse } from './mappers/user.mapper';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingEmail = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    console.log('Creating user with email:', createUserDto);
    const user = await this.userRepository.createUser({
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    });

    return mapUserToResponse(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(loginUserDto.email);

    if (
      !user ||
      !(await this.passwordMatches(loginUserDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return mapUserToResponse(user);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async passwordMatches(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    const [salt, storedKey] = storedPassword.split(':');
    if (!salt || !storedKey) {
      return false;
    }

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const storedKeyBuffer = Buffer.from(storedKey, 'hex');
    return (
      storedKeyBuffer.length === derivedKey.length &&
      timingSafeEqual(storedKeyBuffer, derivedKey)
    );
  }
}
