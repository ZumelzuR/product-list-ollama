import HttpCode from '../../constants/http-code.constant';
import HttpReason from '../../constants/http-reason.constant';
import HttpException from './http.exception';

class UnexpectedException extends HttpException {
  constructor(reason?: string) {
    super(
      HttpCode.INTERNAL_SERVER_ERROR,
      reason ? reason : HttpReason.INTERNAL_SERVER_ERROR
    );
  }
}
export default UnexpectedException;
