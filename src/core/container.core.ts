/* core import */
import { Container } from "inversify";
import { TYPES } from "./type.core";
/* database import */
import { IDatabaseService } from "../modules/database/interfaces/IDatabase.service";
import { DatabaseService } from "../modules/database/database.service";
/* middleware import */
import { GetProviderUserByOauth } from "../middlewares/get-provider-user-by-oauth.middleware";
import { SocialSignUp } from "../middlewares/social-sign-up.middleware";
import { ValidateAccessToken } from "../middlewares/authentication.middleware";

/* controller import */
import "../modules/index.controller";
/* auth import */
import { IAuthService } from "../modules/auth/interfaces/IAuth.service";
import { AuthService } from "../modules/auth/auth.service";
/* user import */
import { IUserService } from "../modules/user/interfaces/IUser.service";
import { UserService } from "../modules/user/user.service";
import { IUserRepository } from "../modules/user/interfaces/IUser.repository";
import { UserRepository } from "../modules/user/user.repository";
/* util import */
import { Logger } from "../utils/logger.util";
import { JwtUtil } from "../utils/jwt.util";

const container = new Container();

/* database */
container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);

/* middleware */
container
  .bind(TYPES.GetProviderUserByOauthMiddleware)
  .to(GetProviderUserByOauth);
container.bind(TYPES.SocialSignUpMiddleware).to(SocialSignUp);
container.bind(TYPES.AuthenticationMiddleware).to(ValidateAccessToken);

/* auth */
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

/* user */
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

/* utils */
container.bind(TYPES.Logger).to(Logger);
container.bind(TYPES.JwtUtil).to(JwtUtil);

export default container;
