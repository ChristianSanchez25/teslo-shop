import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/auth.entity';
import { BcryptAdapter } from './../common/adapters/bcrypt.adapter';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly bcrypt : BcryptAdapter
  ) {}


  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: this.bcrypt.encrypt(password, 10)
      });
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJWTToken({id: user.id})
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: {email: true, password: true, id: true}
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }

    if (!this.bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }

    return {
      ...user,
      token: this.getJWTToken({id: user.id})
    };
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJWTToken({id: user.id})
    };
  }



  private getJWTToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
 
}
