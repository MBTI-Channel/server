import { Post } from "../../post/entity/post.entity";
import { User } from "../../user/entity/user.entity";
import { Survey } from "../entity/survey.entity";

export class SurveyResponseDto {
  id: number;
  postId: number;
  title: string;
  content: string;
  userId: number;
  userMbti: string;
  isAgree: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  constructor(survey: Survey, post: Post, user: User) {
    this.id = survey.id;
    this.postId = post.id;
    this.title = post.title;
    this.content = post.content;
    this.userId = user.id;
    this.userMbti = user.mbti;
    this.isAgree = survey.isAgree;
    this.createdAt = survey.createdAt;
    this.updatedAt =
      post.createdAt.getTime() === post.updatedAt.getTime()
        ? null
        : post.updatedAt;
  }
}
