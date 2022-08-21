import { Mbti } from "../../../shared/enum.shared";
import { Provider } from "../../../shared/type.shared";
import {
  UserTokenResponseDto,
  NeedSignUpResponseDto,
  AccessTokenResponseDto,
} from "../dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  /**
   * user를 생성합니다.
   * @param provider    Oauth 제공 서비스 종류
   * @param providerId  서비스 user의 고유 id
   * @param gender      성별
   * @param ageRange    연령대
   */
  create(
    provider: Provider,
    providerId: string,
    gender?: number,
    ageRange?: string
  ): Promise<NeedSignUpResponseDto>;
  /**
   * user의 닉네임을 업데이트합니다.
   * @return 업데이트된 access token
   */
  updateNickname(user: User, nickname: string): Promise<AccessTokenResponseDto>;
  /**
   * user의 MBTI를 업데이트합니다.
   * @return 업데이트된 access token
   */
  updateMbti(user: User, mbti: Mbti): Promise<any>;
  /**
   * 로그인합니다.
   */
  login(
    id: number,
    providerId: string,
    userAgent: string
  ): Promise<UserTokenResponseDto>;
  /**
   * 로그아웃 합니다.
   */
  logout(id: number, refreshToken: string, userAgent: string): Promise<void>;
  /**
   * 닉네임, mbti를 업데이트하여 회원가입을 진행합니다.
   */
  signUp(
    id: number,
    uuid: string,
    nickname: string,
    mbti: string,
    userAgent: string
  ): Promise<UserTokenResponseDto>;
  /**
   * 회원탈퇴를 진행합니다.
   */
  leave(id: number, refreshToken: string, userAgent: string): Promise<void>;
  /**
   * 새 access token을 발급합니다.
   */
  reissueAccessToken(
    user: User,
    refreshToken: string,
    userAgent: string
  ): Promise<AccessTokenResponseDto>;
  /**
   * 닉네임을 중복를 진행합니다.
   */
  checkDuplicateNickname(nickname: string): Promise<void>;
  /**
   * id에 해당하는 user가 유효한지 확인합니다.
   */
  isValid(id: number): Promise<boolean>;
}
