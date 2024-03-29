import { ContainerModule } from "inversify";
import { TYPES } from "../core/types.core";
import { CheckLoginStatus } from "./check-login-status.middleware";
import { GetProviderUserByOauth } from "./get-provider-user-by-oauth.middleware";
import { SocialSignUp } from "./social-sign-up.middleware";
import { ValidateAccessRefreshToken } from "./validate-access-refresh-token.middleware";
import { ValidateAccessToken } from "./validate-access-token.middleware";
import { ValidateReissueToken } from "./validate-reissue-token.middleware";

export const middlewareModule = new ContainerModule((bind) => {
  bind(TYPES.GetProviderUserByOauthMiddleware).to(GetProviderUserByOauth);
  bind(TYPES.SocialSignUpMiddleware).to(SocialSignUp);
  bind(TYPES.ValidateAccessTokenMiddleware).to(ValidateAccessToken);
  bind(TYPES.ValidateReissueTokenMiddleware).to(ValidateReissueToken);
  bind(TYPES.ValidateAccessRefreshTokenMiddleware).to(
    ValidateAccessRefreshToken
  );
  bind(TYPES.CheckLoginStatusMiddleware).to(CheckLoginStatus);
});
