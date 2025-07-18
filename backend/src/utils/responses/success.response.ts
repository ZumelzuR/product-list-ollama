import { Response } from 'express';
import HttpCode from '../../constants/http-code.constant';
import HttpReason from '../../constants/http-reason.constant';
import { ISuccessBodyResponse } from '../../interfaces/body-response.interface';

/**
 * @deprecated Make a return without using this function
 * @see index.ts -> initializeResponseBodyModifier
 * @param res
 * @param data
 * @param msg
 */
const success = <T = any>(
  res: Response,
  data?,
  msg: string = undefined
): void => {
  const statusCode = HttpCode.OK;
  const statusMsg = msg || HttpReason.OK;

  res.status(statusCode);
  const responseObject: ISuccessBodyResponse<T> = {
    legacy: true,
    ok: true,
    status: {
      code: statusCode,
      msg: statusMsg,
    },
    data,
  };
  res.json(responseObject);
};
export default success;
