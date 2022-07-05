export class UserResponseDto {
  id: number;
  nickname: string;
  mbti: string;
  isAdmin: boolean;
  isActive: boolean;
}

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class UserTokenResponseDto extends UserResponseDto {
  constructor() {
    super();
  }
  accessToken: string;
  refreshToken: string;
}

export class NeedSignUpResponseDto {
  id: number;
  uuid: string;
}
