import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserLogin, UserRegister } from 'src/model/user.model';
import { JwtAuthGuard } from './jwt-auth.guard';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('/register')
  async register(@Body() data: UserRegister): Promise<WebResponse<string>> {
    console.log('Masuk sini!');
    return {
      data: await this.usersService.register(data),
    };
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string, @Res() res) {
    const result = await this.usersService.verifyEmail(token);
    if (result) {
      // Redirect to a deep link for the app or a web page
      return res.redirect('myapp://email_verified');
    } else {
      return res.status(400).send('Verification failed!');
    }
  }

  @Post('/login')
  async login(@Body() body: UserLogin) {
    const user = await this.usersService.validateUser(body);
    if (!user) {
      throw new HttpException('Invalid Credentials', 401);
    }
    return this.usersService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/protected')
  getProtectedData() {
    return {
      message: 'Hello, World!',
    };
  }
}
