import HttpCode from '../../constants/http-code.constant';
import HttpReason from '../../constants/http-reason.constant';
import HttpException from './http.exception';

class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(HttpCode.NOT_FOUND, message ? message : HttpReason.NOT_FOUND);
  }
}
export default NotFoundException;
