import { Matches } from 'class-validator';

export class CreateUserDto {
  name!: string;
  username!: string;
  phoneNumber!: string;
  email!: string;
  @Matches(/^(?=.*\d)(?=.*[A-Z]).+$/, {
    message: 'Password must contain at least one digit and one uppercase letter',
  })
  password!: string;
  isBusinessAccount!: boolean;
}
