import { Container } from "inversify";
import { TYPES } from "./type.core";
/* middleware import */
import { GetProviderUserByOauth } from "../middlewares/get-provider-user-by-oauth.middleware";
/* controller import */
import "../controllers/index.controller";
/* service import */
import { IDatabaseService } from "./interfaces/IDatabase.service";
import { DatabaseService } from "./services/database.service";
/* util import */
import { Logger } from "../utils/logger.util";
import { SocialSignUp } from "../middlewares/social-sign-up.middleware";
import { JwtUtils } from "../utils/jwt.util";
import { IAuthService } from "./interfaces/IAuth.service";
import { AuthService } from "./services/auth.service";
import { IUserService } from "./interfaces/IUser.service";
import { UserService } from "./services/user.service";

const container = new Container();

/* utils */
container.bind(TYPES.Logger).to(Logger);
container.bind(TYPES.JwtUtils).to(JwtUtils);

/* service */
container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);
container.bind<IUserService>(TYPES.IUserService).to(UserService);

/* middleware */
container
  .bind(TYPES.GetProviderUserByOauthMiddleware)
  .to(GetProviderUserByOauth);

container.bind(TYPES.SocialSignUpMiddleware).to(SocialSignUp);

export default container;
