export const TYPES = {
  /* utils */
  Logger: Symbol.for("Logger"),
  JwtUtils: Symbol.for("JwtUtils"),

  /* database */
  IDatabaseService: Symbol.for("IDatabaseService"),
  IAuthService: Symbol.for("IAuthService"),
  IUserService: Symbol.for("IUserService"),

  /* middleware */
  GetProviderUserByOauthMiddleware: Symbol.for(
    "GetProviderUserByOauthMiddleware"
  ),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
};
