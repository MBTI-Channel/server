import container from "../../../../src/core/container.core";
import { TYPES } from "../../../../src/core/type.core";
import { NotFoundException } from "../../../../src/errors/all.exception";
import {
  LoginDto,
  NicknameDuplicateCheckDto,
} from "../../../../src/modules/user/dto";
import { User } from "../../../../src/modules/user/entity/user.entity";
import { IUserService } from "../../../../src/modules/user/interfaces/IUser.service";

describe("UserService ", () => {
  beforeEach(() => {
    // 각 단위 테스트가 다른 단위 테스트를 중단하지 않고 수정할 수 있도록 스냅샷 생성
    container.snapshot();
  });

  afterEach(() => {
    // 각 단위 테스트가 애플리케이션 컨테이너의 새 복사본을 가져오도록 마지막 스냅샷으로 복원
    container.restore();
  });

  /* 닉네임 중복 확인 */
  describe("isExistsNickname", () => {
    const mockDto: NicknameDuplicateCheckDto = {
      nickname: "야옹맨",
    };
    const mockUser = new User();

    it("Case1: DB에 존재하는 닉네임이라면 true를 리턴한다.", async () => {
      // given
      const userService = container.get<IUserService>(TYPES.IUserService);

      userService.findOne = jest.fn().mockImplementation(() => {
        return mockUser;
      });

      // when
      const result = await userService.isExistsNickname(mockDto);

      // then
      expect(result).toEqual(true);
    });

    it("Case2: DB에 존재하지 않는 닉네임이라면 false를 리턴한다.", async () => {
      // given
      const userService = container.get<IUserService>(TYPES.IUserService);
      userService.findOne = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      // when
      const result = await userService.isExistsNickname(mockDto);

      // then
      expect(result).toEqual(false);
    });
  });

  /* 로그인 */
  describe("login", () => {
    const mockUser = new User();
    const mockDto: LoginDto = {
      provider: "naver",
      providerId: "exmaple",
    };

    const mockAccessToken = "mockAccessToken";
    const mockRefreshToken = "mockRefreshToken";

    it("Success: DB에 존재하는 user라면 { user, accessToken, refreshToken } 리턴한다.", async () => {
      // given
      const mockAuthService = {
        generateAccessToken: () => mockAccessToken,
        generateRefreshToken: () => mockRefreshToken,
      };
      container.unbind(TYPES.IAuthService);
      container.bind(TYPES.IAuthService).toConstantValue(mockAuthService);

      const userService = container.get<IUserService>(TYPES.IUserService);

      userService.findOne = jest.fn().mockImplementation(() => mockUser);

      // when
      const result = await userService.login(mockDto);

      // then
      expect(result).toEqual({
        user: mockUser,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });

    it("Error: DB에 존재하지 않는 user라면 NotFoundException 발생", async () => {
      // given
      const userService = container.get<IUserService>(TYPES.IUserService);

      userService.findOne = jest.fn().mockImplementation(() => null);

      // when, then
      await expect(async () => {
        await userService.login(mockDto);
      }).rejects.toThrowError(new NotFoundException("not exists user"));
    });
  });
});
