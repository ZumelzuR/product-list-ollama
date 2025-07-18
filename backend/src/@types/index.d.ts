// Augmented Express Request based on the data that we aggregate via middlewares

declare namespace Express {
  export interface Request {
    auth?: {
      id: string;
      user: IUser;
      lastActivityTime: number;
    };
  }
}
