import { User } from "../entities/user.entity";

//express.Request - namespace - user
declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>;
    }
  }
}
