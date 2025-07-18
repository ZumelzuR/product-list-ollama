import HttpCode from '../../constants/http-code.constant';
import HttpException from './http.exception';

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(HttpCode.CONFLICT, `User with email ${email} already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;
