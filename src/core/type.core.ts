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
  IsNotLoggedInMiddleware: Symbol.for("IsNotLoggedInMiddleware"),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
  ValidateAccessTokenMiddleware: Symbol.for("ValidateAccessTokenMiddleware"),
  ValidateReissueTokenMiddleware: Symbol.for("ValidateReissueTokenMiddleware"),
  /* shared */
  NaverApiService: Symbol.for("NaverOauthService"),
  KakaoApiService: Symbol.for("KakaoOauthService"),
  IOauthService: Symbol.for("IOauthService"),
};
