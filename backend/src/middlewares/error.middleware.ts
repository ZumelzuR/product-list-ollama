import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/http.exception';
import { IErrorBodyResponse } from '../interfaces/body-response.interface';
import { ValidateError } from 'tsoa';
import { UnauthorizedError } from 'express-jwt';
import HttpCode from '../constants/http-code.constant';
import HttpReason from '../constants/http-reason.constant';

const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response<IErrorBodyResponse>,
  next: NextFunction
): Response | void => {
  // Tsoa error when invalid query, paths, body, etc
  if (error instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, error.fields);

    const statusCode = HttpCode.UNPROCESSABLE_ENTITY;
    const statusMsg = error.message || HttpReason.UNPROCESSABLE_ENTITY;

    res.status(statusCode).send({
      ok: false,
      status: {
        code: statusCode,
        msg: statusMsg,
      },
    } satisfies IErrorBodyResponse);
    // TODO THIS COULD BE A DUPLICATE VERSION OF BASE ERORR IF NO HTTPEXCEPTION ARE THROWED
  } else if (error instanceof HttpException) {
    const statusCode = error.status || HttpCode.INTERNAL_SERVER_ERROR;
    const statusMsg = error.message || HttpReason.INTERNAL_SERVER_ERROR;

    res.status(statusCode).send({
      ok: false,
      status: {
        code: statusCode,
        msg: statusMsg,
      },
    } satisfies IErrorBodyResponse);
  } else if (error instanceof UnauthorizedError) {
    const statusCode = HttpCode.UNAUTHORIZED;
    const statusMsg = error.message || HttpReason.UNAUTHORIZED;

    res.status(statusCode).send({
      ok: false,
      status: {
        code: statusCode,
        msg: statusMsg,
      },
    } satisfies IErrorBodyResponse);
  } else if (error instanceof Error) {
    const statusCode = HttpCode.INTERNAL_SERVER_ERROR;
    const statusMsg = error.message || HttpReason.INTERNAL_SERVER_ERROR;

    res.status(statusCode).send({
      ok: false,
      status: {
        code: statusCode,
        msg: statusMsg,
      },
    } satisfies IErrorBodyResponse);
  }

  next();
};

export default errorMiddleware;
