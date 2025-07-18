// Here we should check if the token is valid
import { Request } from 'express';

export const expressAuthentication = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _scopes?: string[]
): Promise<void> => {
  return Promise.resolve();
};
