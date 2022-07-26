/* core import */
import { Container } from "inversify";
/* controller import */
import "../modules/index.controller";
/* app import */
import { middlewareModule } from "../middlewares/middleware.module";
import { userModule } from "../modules/user/user.module";
import { postModule } from "../modules/post/post.module";
import { notificationModule } from "../modules/notifications/notification.module";
import { loginLogModule } from "../modules/login-log/login-log.module";
import { likeModule } from "../modules/like/like.module";
import { commentModule } from "../modules/comment/comment.module";
import { categoryModule } from "../modules/category/category.module";
import { bookmarkMoudle } from "../modules/bookmark/bookmark.module";
import { authModule } from "../modules/auth/auth.module";
import { askModule } from "../modules/ask/ask.module";
/* shared import */
import { utilModule } from "../shared/utils/util.module";
import { databaseModule } from "../shared/database/database.module";
import { redisModule } from "../shared/redis/redis.module";
import { apiModule } from "../shared/api/api.module";
import { oauthModule } from "../shared/oauth/oauth.module";

const container = new Container();

container.load(
  /* core */
  /* app */
  middlewareModule,
  askModule,
  authModule,
  bookmarkMoudle,
  categoryModule,
  commentModule,
  likeModule,
  loginLogModule,
  notificationModule,
  postModule,
  userModule,
  /* util */
  utilModule,
  /* shared */
  apiModule,
  oauthModule,
  databaseModule,
  redisModule
);

export default container;
