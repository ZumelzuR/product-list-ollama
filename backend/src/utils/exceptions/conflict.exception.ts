import HttpCode from '../../constants/http-code.constant';
import HttpReason from '../../constants/http-reason.constant';
import HttpException from './http.exception';

class ConflictException extends HttpException {
  constructor(message?: string) {
    super(HttpCode.CONFLICT, message ? message : HttpReason.CONFLICT);
  }
}
export default ConflictException;
