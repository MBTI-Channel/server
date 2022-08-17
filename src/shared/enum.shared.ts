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

export enum SearchOption {
  TITLE = "title",
  CONTENT = "content",
  ALL = "all",
}

export enum CategoryName {
  MBTI = "mbti",
  LOVE = "love",
  SCHOOL = "school",
  WORKLIFE = "workLife",
  MUSIC = "music",
  MOVIE = "movie",
  TRIP = "trip",
  HOBBY = "hobby",
}

export enum LikeTargetType {
  POST = "post",
  COMMENT = "comment",
}

export enum ReportTargetType { // TODO: LikeTargetType랑 중복
  POST = "post",
  COMMENT = "comment",
}

export enum Mbti {
  ISTJ = "ISTJ",
  ISTP = "ISTP",
  ISFJ = "ISFJ",
  ISFP = "ISFP",
  INTJ = "INTJ",
  INTP = "INTP",
  INFJ = "INFJ",
  INFP = "INFP",
  ESTJ = "ESTJ",
  ESTP = "ESTP",
  ESFJ = "ESFJ",
  ESFP = "ESFP",
  ENTJ = "ENTJ",
  ENTP = "ENTP",
  ENFJ = "ENFJ",
  ENFP = "ENFP",
}
