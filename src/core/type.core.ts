export const TYPES = {
  /* utils */
  Logger: Symbol.for("Logger"),
  JwtUtil: Symbol.for("JwtUtil"),
  /* database */
  IDatabaseService: Symbol.for("IDatabaseService"),
  /* redis */
  IRedisService: Symbol.for("IRedisService"),
  /* auth */
  IAuthService: Symbol.for("IAuthService"),
  /* user */
  IUserService: Symbol.for("IUserService"),
  IUserRepository: Symbol.for("IUserRepository"),
  /* middleware */
  GetProviderUserByOauthMiddleware: Symbol.for(
    "GetProviderUserByOauthMiddleware"
  ),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
  ValidateAccessTokenMiddleware: Symbol.for("ValidateAccessTokenMiddleware"),
  ValidateReissueTokenMiddleware: Symbol.for("ValidateReissueTokenMiddleware"),
  /* shared */
  NaverOauthService: Symbol.for("NaverOauthService"),
  KakaoOauthService: Symbol.for("KakaoOauthService"),
};
