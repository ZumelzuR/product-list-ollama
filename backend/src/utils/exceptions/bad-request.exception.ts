import HttpCode from '../../constants/http-code.constant';
import HttpReason from '../../constants/http-reason.constant';
import HttpException from './http.exception';

class BadRequestException extends HttpException {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(reason?: string | any) {
    super(HttpCode.BAD_REQUEST, reason ? reason : HttpReason.BAD_REQUEST);
  }
}
export default BadRequestException;
