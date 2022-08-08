export enum Order {
  DESC = "DESC",
  ASC = "ASC",
}

export enum CommentOrder {
  LIKES_COUNT = "likesCount",
  CREATED_AT = "createdAt",
}

export enum PostOrder {
  LIKES_COUNT = "likesCount",
  CREATED_AT = "createdAt",
  VIEW_COUNT = "viewCount",
}

export enum PostType {
  POST = "post",
  MBTI = "mbti",
  SURVEY = "survey",
  NOTICE = "notice",
}

export enum CategoryName {
  TRIP = "trip",
  MBTI = "mbti",
  GAME = "game",
  LOVE = "love",
}

export enum LikeTargetType {
  POST = "post",
  COMMENT = "comment",
}

export enum ReportTargetType { // TODO: LikeTargetType랑 중복
  POST = "post",
  COMMENT = "comment",
}
