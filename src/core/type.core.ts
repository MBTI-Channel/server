export const TYPES = {
  /* utils */
  Logger: Symbol.for("Logger"),
  JwtUtils: Symbol.for("JwtUtils"),

  /* service */
  IDatabaseService: Symbol.for("IDatabaseService"),
  IAuthService: Symbol.for("IAuthService"),

  /* middleware */
  GetProviderUserByOauthMiddleware: Symbol.for(
    "GetProviderUserByOauthMiddleware"
  ),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
};
