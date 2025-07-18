export interface IBodyResponse {
  ok: boolean;
  status: {
    code: number;
    msg: string;
  };
}

export interface ISuccessBodyResponse<T = any> extends IBodyResponse {
  ok: true;
  legacy?: true;
  data: T;
}

export interface IErrorBodyResponse extends IBodyResponse {
  ok: false;
}
