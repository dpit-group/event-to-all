import { Body, Controller, Post } from '@nestjs/common';
import * as CreateUserDtoModule from './dto/create-user.dto';
import * as LoginUserDtoModule from './dto/login-user.dto';
import type { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(
    @Body() createUserDto: CreateUserDtoModule.CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDtoModule.LoginUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.login(loginUserDto);
  }
}
