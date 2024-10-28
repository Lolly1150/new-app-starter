import { Inject, Injectable, IntentConfig } from '@intentjs/core';
import { UserModel } from 'app/models/userModel';
import { UserDbRepository } from 'app/repositories/userDbRepository';
import { LoginDto, RegisterDto } from 'app/validators/auth';
import { hashSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ulid } from 'ulid';

@Injectable()
export class AuthService {
  constructor(
    private config: IntentConfig,
    @Inject('USER_DB_REPO') private users: UserDbRepository,
  ) {}

  async register(dto: RegisterDto): Promise<UserModel> {
    // const existingUser = await this.users.firstWhere(
    //   { email: dto.email },
    //   false,
    // );

    // if (existingUser) {
    //   throw new ValidationFailed({
    //     email: ['Email is already used by another account!'],
    //   });
    // }

    // console.log(existingUser);

    const user = await this.users.create({
      id: ulid(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashSync(dto.password, 10),
    });

    user.token = await this.makeToken({
      sub: user.id,
      env: IntentConfig.get('app.env'),
      emailVerifiedAt: user.emailVerifiedAt,
      passwordChangedAt: user.passwordChangedAt,
    });

    console.log(user);

    return user;
  }

  async login(dto: LoginDto): Promise<UserModel> {
    const user = await this.users.firstWhere({ email: dto.email });
    console.log(user);
    return user;
  }

  async makeToken(payload: Record<string, any>): Promise<string> {
    return sign(payload, IntentConfig.get('auth.secret'), {
      issuer: IntentConfig.get('app.url'),
      expiresIn: IntentConfig.get('auth.ttl'),
    });
  }
}
