/* core import */
import { Container } from "inversify";
import { TYPES } from "./type.core";
/* database import */
import { IDatabaseService } from "../shared/database/interfaces/IDatabase.service";
import { DatabaseService } from "../shared/database/database.service";
/* redis import */
import { IRedisService } from "../shared/redis/interfaces/IRedis.service";
import { RedisService } from "../shared/redis/redis.service";
/* middleware import */
import { GetProviderUserByOauth } from "../middlewares/get-provider-user-by-oauth.middleware";
import { SocialSignUp } from "../middlewares/social-sign-up.middleware";
import { ValidateAccessToken } from "../middlewares/validate-access-token.middleware";
import { ValidateReissueToken } from "../middlewares/validate-reissue-token.middleware";
import { CheckLoginStatus } from "../middlewares/check-login-status.middleware";
/* controller import */
import "../modules/index.controller";
/* auth import */
import { IAuthService } from "../modules/auth/interfaces/IAuth.service";
import { AuthService } from "../modules/auth/auth.service";
/* user import */
import { IUserService } from "../modules/user/interfaces/IUser.service";
import { UserService } from "../modules/user/user.service";
import { IUserRepository } from "../modules/user/interfaces/IUser.repository";
import { UserRepository } from "../modules/user/user.repository";
/* post import */
import { IPostService } from "../modules/post/interfaces/IPost.service";
import { PostService } from "../modules/post/post.service";
import { IPostRepository } from "../modules/post/interfaces/IPost.repository";
import { PostRepository } from "../modules/post/post.repository";
/* category import */
import { ICategoryRepository } from "../modules/category/interfaces/ICategory.repository";
import { CategoryRepository } from "../modules/category/category.repository";
/* comment import */
import { ICommentService } from "../modules/comment/interfaces/IComment.service";
import { CommentService } from "../modules/comment/comment.service";
import { ICommentRepository } from "../modules/comment/interfaces/IComment.repository";
import { CommentRepository } from "../modules/comment/comment.repository";
/* notification import */
import { INotificationService } from "../modules/notifications/interfaces/INotification.service";
import { NotificationService } from "../modules/notifications/notification.service";
import { INotificationRepository } from "../modules/notifications/interfaces/INotification.repository";
import { NotificationtRepository } from "../modules/notifications/notification.repository";
/* login-log import */
import { ILoginLogService } from "../modules/login-log/interfaces/ILogin-log.service";
import { LoginLogService } from "../modules/login-log/login-log.service";
/* util import */
import { Logger } from "../shared/utils/logger.util";
import { JwtUtil } from "../shared/utils/jwt.util";
/* shared import */
import { OauthService } from "../shared/oauth/oauth.service";
import { KakaoApiService } from "../shared/api/kakao-api.service";
import { NaverApiService } from "../shared/api/naver-api.service";

const container = new Container();

/* database */
container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);

/* redis */
container.bind<IRedisService>(TYPES.IRedisService).to(RedisService);

/* middleware */
container
  .bind(TYPES.GetProviderUserByOauthMiddleware)
  .to(GetProviderUserByOauth);
container.bind(TYPES.SocialSignUpMiddleware).to(SocialSignUp);
container.bind(TYPES.ValidateAccessTokenMiddleware).to(ValidateAccessToken);
container.bind(TYPES.ValidateReissueTokenMiddleware).to(ValidateReissueToken);
container.bind(TYPES.CheckLoginStatusMiddleware).to(CheckLoginStatus);

/* auth */
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

/* user */
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

/* post */
container.bind<IPostService>(TYPES.IPostService).to(PostService);
container.bind<IPostRepository>(TYPES.IPostRepository).to(PostRepository);

/* category */
container
  .bind<ICategoryRepository>(TYPES.ICategoryRepository)
  .to(CategoryRepository);

/* comment */
container.bind<ICommentService>(TYPES.ICommentService).to(CommentService);
container
  .bind<ICommentRepository>(TYPES.ICommentRepository)
  .to(CommentRepository);

/* notification */
container
  .bind<INotificationService>(TYPES.INotificationService)
  .to(NotificationService);
container
  .bind<INotificationRepository>(TYPES.INotificationRepository)
  .to(NotificationtRepository);

/* login-log */
container.bind<ILoginLogService>(TYPES.ILoginLogService).to(LoginLogService);

/* utils */
container.bind(TYPES.Logger).to(Logger);
container.bind(TYPES.JwtUtil).to(JwtUtil);

/* shared */
container.bind(TYPES.NaverApiService).to(NaverApiService);
container.bind(TYPES.KakaoApiService).to(KakaoApiService);
container.bind(TYPES.IOauthService).to(OauthService);

export default container;
