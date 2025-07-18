import ISuccess from './success/success.interface';

/**
 * @deprecated
 */
interface IError extends ISuccess {
  msg: [string] | string;
}

export default IError;
