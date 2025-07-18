import { Router, Request as ExRequest } from 'express';
import { check } from 'express-validator';
import { Controller } from '@tsoa/runtime';
import {
  Body,
  Middlewares,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { LoginBody, TokenDto } from '../../dto/auth/token.dto';
import addUser from './implementation/add-user.implementation';
import loginImpl from './implementation/login.implementation';
import validationErrors from '../../middlewares/validation-errors.middleware';

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {

  public router = Router();

  @Response('400', 'Unexpected error')
  @Post('token')
  @Middlewares([
    check('email')
      .isEmail()
      .withMessage("Invalid email")
      .trim(),
    check('password').exists().trim(),
    validationErrors
  ])
  async login(
    @Body() loginBody: LoginBody
  ): Promise<TokenDto> {
    return loginImpl(loginBody);
  }

  @Response('400', 'Unexpected error')
  @SuccessResponse('201', "Success created")
  @Post('register')
  @Middlewares([
    check('email')
      .isEmail()
      .withMessage("Invalid email")
      .trim(),
    check('password')
      .isString()
      .notEmpty()
      .withMessage("Invalid password")
      .trim(),
    validationErrors
  ])
  async addUser(
    @Body() resgisterBody: any
  ) {
    return addUser(resgisterBody);
  }
}
