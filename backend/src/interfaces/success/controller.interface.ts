import { Router } from 'express';

interface IController {
  path: string;
  router: Router;
  roles?: string[];
  protected?: boolean;
}

export default IController;
