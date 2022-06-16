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

const container = new Container();

container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);
container.bind(TYPES.Logger).to(Logger);

/* middleware */
container
  .bind(TYPES.GetProviderUserByOauthMiddleware)
  .to(GetProviderUserByOauth);

container.bind(TYPES.SocialSignUpMiddleware).to(SocialSignUp);

export default container;
