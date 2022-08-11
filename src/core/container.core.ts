/* core import */
import { Container } from "inversify";
import { databaseModule } from "./database/database.module";
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
import { reportModule } from "../modules/report/report.module";
/* shared import */
import { utilModule } from "../shared/utils/util.module";
import { apiModule } from "../shared/api/api.module";
import { surveyModule } from "../modules/survey/survey.module";

const container = new Container({ defaultScope: "Singleton" });

container.load(
  /* core */
  databaseModule,
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
  reportModule,
  surveyModule,
  userModule,
  /* shared */
  utilModule,
  apiModule
);
export default container;
