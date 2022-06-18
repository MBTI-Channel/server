export const TYPES = {
  /* utils */
  Logger: Symbol.for("Logger"),
  JwtUtil: Symbol.for("JwtUtil"),
  /* database */
  IDatabaseService: Symbol.for("IDatabaseService"),
  /* auth */
  IAuthService: Symbol.for("IAuthService"),
  /* user */
  IUserService: Symbol.for("IUserService"),
  /* middleware */
  GetProviderUserByOauthMiddleware: Symbol.for(
    "GetProviderUserByOauthMiddleware"
  ),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
};
