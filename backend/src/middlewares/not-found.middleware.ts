import { Request, Response } from 'express';
import HttpCode from '../constants/http-code.constant';
import HttpReason from '../constants/http-reason.constant';

const NotFoundMiddleware = (_req: Request, res: Response): Response | void => {
  const statusCode = HttpCode.NOT_FOUND;
  const statusMsg = HttpReason.NOT_FOUND;
  const customMessage = HttpReason.NOT_FOUND_CUSTOM__MESSAGE;

  return res.status(statusCode).send({
    ok: false,
    status: {
      code: statusCode,
      msg: statusMsg,
    },
    msg: customMessage,
  });
};

export default NotFoundMiddleware;
