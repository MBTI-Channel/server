import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { CommentRepository } from "./comment.repository";
import { CommentService } from "./comment.service";
import { ICommentRepository } from "./interfaces/IComment.repository";
import { ICommentService } from "./interfaces/IComment.service";

export const commentModule = new ContainerModule((bind) => {
  bind<ICommentService>(TYPES.ICommentService).to(CommentService);
  bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepository);
});
