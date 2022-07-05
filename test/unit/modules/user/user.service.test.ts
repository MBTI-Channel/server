import container from "../../../../src/core/container.core";
import { TYPES } from "../../../../src/core/type.core";
import {
  BadReqeustException,
  NotFoundException,
  UnauthorizedException,
} from "../../../../src/shared/errors/all.exception";
import { IUserService } from "../../../../src/modules/user/interfaces/IUser.service";

describe("UserService ", () => {
  const mockUserId = 1;
  const mockUserProviderId = "1";
  const mockUUID = "1";
  const mockNickname = "1";
  const mockMbti = "1";
  const mockAccessToken = "mockAccessToken";
  const mockRefreshToken = "mockRefreshToken";
  const mockUserTokenResponseDto = "1";
  beforeEach(() => {
    // 각 단위 테스트가 다른 단위 테스트를 중단하지 않고 수정할 수 있도록 스냅샷 생성
    container.snapshot();
  });

  afterEach(() => {
    // 각 단위 테스트가 애플리케이션 컨테이너의 새 복사본을 가져오도록 마지막 스냅샷으로 복원
    container.restore();
  });

  /* 로그인 */
  describe("login", () => {
    it("Success: D존재하는 user id + providerID 일치라면 UserTokenResponseDto 리턴한다.", async () => {
      // given
      const mockUser = { providerId: "1" };
      const mockUserRepository = {
        findOneById: () => mockUser,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const mockAuthService = {
        generateAccessToken: () => mockAccessToken,
        generateRefreshToken: () => mockRefreshToken,
      };
      container.unbind(TYPES.IAuthService);
      container.bind(TYPES.IAuthService).toConstantValue(mockAuthService);
      const spyGenerateAccessToken = jest.spyOn(
        mockAuthService,
        "generateAccessToken"
      );
      const spyRefreshAccessToken = jest.spyOn(
        mockAuthService,
        "generateRefreshToken"
      );

      const userService = container.get<IUserService>(TYPES.IUserService);
      jest
        .spyOn(userService as any, "_toUserTokenResponseDto")
        .mockReturnValue(mockUserTokenResponseDto);
      // when
      const result = await userService.login(mockUserId, mockUserProviderId);

      // then
      expect(spyGenerateAccessToken).toBeCalledTimes(1);
      expect(spyRefreshAccessToken).toBeCalledTimes(1);
      expect(result).toEqual(mockUserTokenResponseDto);
    });

    it("Error: 존재하지 않는 user id라면 NotFoundException 발생", async () => {
      // given
      const mockUserRepository = {
        findOneById: () => null,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const userService = container.get<IUserService>(TYPES.IUserService);

      // when, then
      await expect(async () => {
        await userService.login(mockUserId, mockUserProviderId);
      }).rejects.toThrowError(new NotFoundException("not exists user"));
    });

    it("Error: 요청 providerId와 user providerID가 다르면 UnauthorizedException 발생", async () => {
      // given
      const mockUser = { providerId: "ERROR" };
      const mockUserRepository = {
        findOneById: () => mockUser,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const userService = container.get<IUserService>(TYPES.IUserService);

      // when, then
      await expect(async () => {
        await userService.login(mockUserId, mockUserProviderId);
      }).rejects.toThrowError(new UnauthorizedException("user does not match"));
    });
  });

  /* 회원가입 */
  describe("signup", () => {
    const mockAccessToken = "mockAccessToken";
    const mockRefreshToken = "mockRefreshToken";

    it("Success: user의 nickname, mbti 설정 후 {user, accessToken, refreshToken} 리턴", async () => {
      // given
      const mockUser = {
        uuid: mockUUID,
        status: +process.env.USER_STATUS_NEW!,
      };
      const mockUpdatedUser = {
        id: mockUserId,
        nickname: mockNickname,
        mbti: mockMbti,
        status: +process.env.USER_STATUS_NORMAL!,
      };

      const mockAuthService = {
        generateAccessToken: () => mockAccessToken,
        generateRefreshToken: () => mockRefreshToken,
      };
      container.unbind(TYPES.IAuthService);
      container.bind(TYPES.IAuthService).toConstantValue(mockAuthService);
      const spyGenerateAccessToken = jest.spyOn(
        mockAuthService,
        "generateAccessToken"
      );
      const spyRefreshAccessToken = jest.spyOn(
        mockAuthService,
        "generateRefreshToken"
      );

      const mockUserRepository = {
        findOneById: () => mockUser,
        update: () => mockUpdatedUser,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const userService = container.get<IUserService>(TYPES.IUserService);
      jest
        .spyOn(userService as any, "_toUserTokenResponseDto")
        .mockReturnValue(mockUserTokenResponseDto);

      userService.isExistsNickname = jest.fn().mockImplementation(() => false);
      userService.update = jest.fn().mockReturnValue(mockUpdatedUser);

      // when
      const result = await userService.signUp(
        mockUserId,
        mockUUID,
        mockNickname,
        mockMbti
      );

      //then
      expect(spyGenerateAccessToken).toBeCalledTimes(1);
      expect(spyRefreshAccessToken).toBeCalledTimes(1);
      expect(result).toEqual(mockUserTokenResponseDto);
    });

    it("Error: 존재하지 않는 user id라면 NotFoundException 발생", async () => {
      // given
      const mockUserRepository = {
        findOneById: () => null,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const userService = container.get<IUserService>(TYPES.IUserService);

      // when, then
      await expect(async () => {
        await userService.signUp(mockUserId, mockUUID, mockNickname, mockMbti);
      }).rejects.toThrowError(new NotFoundException("not exists user"));
    });

    it("Error: 요청 uuid와 user uuid가 다르다면 UnauthorizedException 발생", async () => {
      // given
      const mockUser = { uuid: "ERROR" };
      const mockUserRepository = {
        findOneById: () => mockUser,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const userService = container.get<IUserService>(TYPES.IUserService);

      // when, then
      await expect(async () => {
        await userService.signUp(mockUserId, mockUUID, mockNickname, mockMbti);
      }).rejects.toThrowError(new UnauthorizedException("user does not match"));
    });

    it("Error: user status가 new가 아니라면 BadReqeustException 발생", async () => {
      // given
      const mockUser = {
        uuid: mockUUID,
        status: +process.env.USER_STATUS_NORMAL!,
      };
      const mockUserRepository = {
        findOneById: () => mockUser,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const userService = container.get<IUserService>(TYPES.IUserService);

      // when, then
      await expect(async () => {
        await userService.signUp(mockUserId, mockUUID, mockNickname, mockMbti);
      }).rejects.toThrowError(new BadReqeustException("already sign up user"));
    });

    it("Error: 이미 존재하는 닉네임이라면 ConflictException 발생", async () => {
      // given
      const mockUser = {
        uuid: mockUUID,
        status: +process.env.USER_STATUS_NEW!,
      };
      const mockUserRepository = {
        findOneById: () => mockUser,
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const userService = container.get<IUserService>(TYPES.IUserService);

      userService.isExistsNickname = jest.fn().mockImplementation(() => true);

      // when, then
      await expect(async () => {
        await userService.signUp(mockUserId, mockUUID, mockNickname, mockMbti);
      }).rejects.toThrowError(new NotFoundException("already exists nickname"));
    });

    // /* 닉네임 중복 확인 */
    describe("isExistsNickname", () => {
      it("Case 1: DB에 존재하는 닉네임이라면 true를 리턴한다.", async () => {
        // given
        const mockUserRepository = {
          findOneByNickname: () => true,
        };
        container.unbind(TYPES.IUserRepository);
        container
          .bind(TYPES.IUserRepository)
          .toConstantValue(mockUserRepository);
        const userService = container.get<IUserService>(TYPES.IUserService);

        // when
        const result = await userService.isExistsNickname(mockNickname);

        // then
        expect(result).toEqual(true);
      });

      it("Case 2: DB에 존재하지 않는 닉네임이라면 false를 리턴한다.", async () => {
        // given
        const mockUserRepository = {
          findOneByNickname: () => false,
        };
        container.unbind(TYPES.IUserRepository);
        container
          .bind(TYPES.IUserRepository)
          .toConstantValue(mockUserRepository);

        const userService = container.get<IUserService>(TYPES.IUserService);

        // when
        const result = await userService.isExistsNickname(mockNickname);

        // then
        expect(result).toEqual(false);
      });
    });
  });
});
