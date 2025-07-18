class HttpException extends Error {
  public status: number;
  public message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(status: number, message: string | any) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
