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
  /* post */
  IPostService: Symbol.for("IPostService"),
  IPostRepository: Symbol.for("IPostRepository"),
  /* category */
  ICategoryRepository: Symbol.for("ICategoryRepository"),
  /* middleware */
  GetProviderUserByOauthMiddleware: Symbol.for(
    "GetProviderUserByOauthMiddleware"
  ),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
  ValidateAccessTokenMiddleware: Symbol.for("ValidateAccessTokenMiddleware"),
  ValidateReissueTokenMiddleware: Symbol.for("ValidateReissueTokenMiddleware"),
  /* shared */
  NaverApiService: Symbol.for("NaverOauthService"),
  KakaoApiService: Symbol.for("KakaoOauthService"),
  IOauthService: Symbol.for("IOauthService"),
};
