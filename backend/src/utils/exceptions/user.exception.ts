import HttpCode from '../../constants/http-code.constant';
import HttpException from './http.exception';

class UserNotFoundException extends HttpException {
  constructor(id: string) {
    super(HttpCode.NOT_FOUND, `User with id ${id} not found`);
  }
}

export default UserNotFoundException;
