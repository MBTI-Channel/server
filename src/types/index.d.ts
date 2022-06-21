import { User } from "../modules/user/entity/user.entity";

//express.Request - namespace - user
declare global {
  namespace Express {
    interface Request {
      user?: Partial<User>;
      accessToken?: string;
    }
  }
}
