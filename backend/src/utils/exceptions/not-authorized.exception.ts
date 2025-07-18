import HttpCode from '../../constants/http-code.constant';
import HttpReason from '../../constants/http-reason.constant';
import HttpException from './http.exception';

class NotAuthorizedException extends HttpException {
  constructor(message?: string) {
    super(HttpCode.UNAUTHORIZED, message ? message : HttpReason.UNAUTHORIZED);
  }
}
export default NotAuthorizedException;
