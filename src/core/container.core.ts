/* core import */
import { Container } from "inversify";
import { TYPES } from "./type.core";
/* database import */
import { IDatabaseService } from "../modules/database/interfaces/IDatabase.service";
import { DatabaseService } from "../modules/database/database.service";
/* middleware import */
import { GetProviderUserByOauth } from "../middlewares/get-provider-user-by-oauth.middleware";
import { SocialSignUp } from "../middlewares/social-sign-up.middleware";
/* controller import */
import "../modules/index.controller";
/* auth import */
import { IAuthService } from "../modules/auth/interfaces/IAuth.service";
import { AuthService } from "../modules/auth/auth.service";
/* user import */
import { IUserService } from "../modules/user/interfaces/IUser.service";
import { UserService } from "../modules/user/user.service";
/* util import */
import { Logger } from "../utils/logger.util";
import { JwtUtils } from "../utils/jwt.util";

const container = new Container();

/* database */
container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);

/* middleware */
container
  .bind(TYPES.GetProviderUserByOauthMiddleware)
  .to(GetProviderUserByOauth);
container.bind(TYPES.SocialSignUpMiddleware).to(SocialSignUp);

/* auth */
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

/* user */
container.bind<IUserService>(TYPES.IUserService).to(UserService);

/* utils */
container.bind(TYPES.Logger).to(Logger);
container.bind(TYPES.JwtUtils).to(JwtUtils);

export default container;
