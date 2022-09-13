import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RoleProtected, GetUser, Auth } from './decorators';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {

    return this.authService.checkAuthStatus(user);
  }



  @Get('private')
  @RoleProtected(ValidRoles.USER)
  @UseGuards(AuthGuard(), UserRoleGuard)
  getPrivate(
    @GetUser() user: User,
  ) {
    return {
      user
    };
  }

  @Get('private2')
  @Auth()
  getPrivate2(
    @GetUser() user: User,
  ) {
    return {
      user
    };
  }

}
