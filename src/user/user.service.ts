import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { UserLogin, UserRegister } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ValidationService } from 'src/common/validation.service';
import { UserValidation } from './user.validation';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private validationService: ValidationService,
  ) {}
  async register(data: UserRegister): Promise<string> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException('Email is already taken', 500);
    }
    this.validationService.validate(UserValidation.REGISTER, data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
      },
    });
    const token = Buffer.from(data.email).toString('base64');
    await this.sendVerificationEmail(user.email, token);
    return 'User Registered. Check your email for verification';
  }

  async verifyEmail(token: string): Promise<any> {
    const email = Buffer.from(token, 'base64').toString('ascii');
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) throw new Error('Invalid token');

    await this.prismaService.user.update({
      where: { email },
      data: { is_verified: true },
    });

    return true;
  }

  async sendVerificationEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'c14210206@john.petra.ac.id',
        pass: 'petra2605',
      },
    });
    const verificationUrl = `http://localhost:3000/api/user/verify?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify Your Email Address',
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #555;">Welcome to Our Platform,</h2>
            <p>Hi ${email.split('@')[0]},</p>
            <p>Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}"
               style="
                 display: inline-block;
                 padding: 10px 20px;
                 margin: 20px 0;
                 font-size: 16px;
                 color: white;
                 background-color: #007BFF;
                 text-decoration: none;
                 border-radius: 5px;">
              Verify Email
            </a>
            <p>If you did not sign up for this account, you can safely ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #777;">
              If the button above does not work, copy and paste this link into your browser:
              <br>
              <a href="${verificationUrl}" style="color: #007BFF;">${verificationUrl}</a>
            </p>
            <p style="font-size: 12px; color: #777;">Need help? Contact us at support@example.com</p>
          </div>
        `,
    });
  }

  async validateUser(data: UserLogin): Promise<User | null> {
    this.validationService.validate(UserValidation.LOGIN, data);
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (user && (await bcrypt.compare(data.password, user.password))) {
      if (!user.is_verified) {
        throw new HttpException(
          'User account is not active',
          HttpStatus.FORBIDDEN,
        );
      }
      return user;
    }
    return null;
  }

  async login(data: User): Promise<any> {
    const payLoad = { email: data.email, sub: data.id };
    return {
      access_token: this.jwtService.sign(payLoad),
    };
  }
}
