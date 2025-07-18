import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import BadRequestException from '../utils/exceptions/bad-request.exception';

const validationErrors = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    next(new BadRequestException(errorMessages));
    return;
  }
  next();
};

export default validationErrors;
