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
  /* comment */
  ICommentService: Symbol.for("ICommentService"),
  ICommentRepository: Symbol.for("ICommentRepository"),
  /* notification */
  INotificationService: Symbol.for("INotificationService"),
  INotificationRepository: Symbol.for("INotificationRepository"),
  /* login-log */
  ILoginLogService: Symbol.for("ILoginLogService"),
  ILoginLogRepository: Symbol.for("ILoginLogRepository"),
  /* middleware */
  GetProviderUserByOauthMiddleware: Symbol.for(
    "GetProviderUserByOauthMiddleware"
  ),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
  ValidateAccessTokenMiddleware: Symbol.for("ValidateAccessTokenMiddleware"),
  ValidateReissueTokenMiddleware: Symbol.for("ValidateReissueTokenMiddleware"),
  CheckLoginStatusMiddleware: Symbol.for("CheckLoginStatusMiddleware"),
  /* shared */
  NaverApiService: Symbol.for("NaverOauthService"),
  KakaoApiService: Symbol.for("KakaoOauthService"),
  IOauthService: Symbol.for("IOauthService"),
};
