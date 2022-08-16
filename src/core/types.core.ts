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
  /* update-log */
  IUpdateLogService: Symbol.for("IUpdateLogService"),
  IUpdateLogRepository: Symbol.for("IUpdateLogRepository"),
  /* ask */
  IAskService: Symbol.for("IAskService"),
  IAskRepository: Symbol.for("IAskRepository"),
  /* bookmark */
  IBookmarkService: Symbol.for("IBookmarkService"),
  IBookmarkRepository: Symbol.for("IBookmarkRepository"),
  /* like */
  ILikeService: Symbol.for("ILikeService"),
  ILikeRepository: Symbol.for("ILikeRepository"),
  /* report */
  IReportService: Symbol.for("IReportService"),
  IReportRepository: Symbol.for("IReportRepository"),
  /* trend */
  ITrendService: Symbol.for("ITrendService"),
  ITrendRepository: Symbol.for("ITrendRepository"),
  /* survey */
  ISurveyService: Symbol.for("ISurveyService"),
  ISurveyRepository: Symbol.for("ISurveyRepository"),
  /* middleware */
  GetProviderUserByOauthMiddleware: Symbol.for(
    "GetProviderUserByOauthMiddleware"
  ),
  SocialSignUpMiddleware: Symbol.for("SocialSignUpMiddleware"),
  ValidateAccessTokenMiddleware: Symbol.for("ValidateAccessTokenMiddleware"),
  ValidateReissueTokenMiddleware: Symbol.for("ValidateReissueTokenMiddleware"),
  ValidateAccessRefreshTokenMiddleware: Symbol.for(
    "ValidateAccessRefreshTokenMiddleware"
  ),
  CheckLoginStatusMiddleware: Symbol.for("CheckLoginStatusMiddleware"),
  /* shared */
  IApiWebhookService: Symbol.for("IApiWebhookService"),
  NaverApiService: Symbol.for("NaverOauthService"),
  KakaoApiService: Symbol.for("KakaoOauthService"),
  IOauthService: Symbol.for("IOauthService"),
};
