export class SearchDetailResponseDto {
  id: number;
  categoryId: number;
  type: number;
  userId: number;
  userMbti: string;
  userNickname: string;
  isActiveUser: boolean;
  isSecret: boolean;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  likesCount: number;
  reportCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isMy: boolean;
}
