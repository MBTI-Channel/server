import container from "../../../../src/core/container.core";
import { TYPES } from "../../../../src/core/type.core";
import { UnauthorizedException } from "../../../../src/shared/errors/all.exception";
import { DecodedDto } from "../../../../src/modules/auth/dtos/decode-token.dto";
import { IAuthService } from "../../../../src/modules/auth/interfaces/IAuth.service";
import { User } from "../../../../src/modules/user/entity/user.entity";

describe("AuthService ", () => {
  beforeEach(() => {
    // 각 단위 테스트가 다른 단위 테스트를 중단하지 않고 수정할 수 있도록 스냅샷 생성
    container.snapshot();
  });

  afterEach(() => {
    // 각 단위 테스트가 애플리케이션 컨테이너의 새 복사본을 가져오도록 마지막 스냅샷으로 복원
    container.restore();
  });

  // payload의 데이터가 이상이 없는지 확인
  describe("validateUserWithToken", () => {
    const mockDto: DecodedDto = {
      id: 1,
      nickname: "exmaple",
      mbti: "ISTP",
      isAdmin: false,
      iss: "example",
      iat: 1000,
      exp: 1000,
      status: "success",
    };

    it("Success: 존재하는 user id && status === normal && 닉네임, mbti가 일치", async () => {
      // given
      const mockUser: Partial<User> = {
        id: 1,
        nickname: "exmaple",
        mbti: "ISTP",
        status: +process.env.USER_STATUS_NORMAL!,
      };
      const mockUserRepository = {
        findOneById: jest.fn(() => mockUser),
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const authService = container.get<IAuthService>(TYPES.IAuthService);

      // when
      const result = await authService.validateUserWithToken(mockDto);

      // then
      expect(result).toBe(undefined);
      expect(mockUserRepository.findOneById).toHaveBeenCalledTimes(1);
    });

    it("Error: DB에 존재하지 않는 id라면 UnauthorizedException 발생", async () => {
      // given
      const mockUserRepository = {
        findOneById: jest.fn(() => false),
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const authService = container.get<IAuthService>(TYPES.IAuthService);

      // when, then
      await expect(async () => {
        await authService.validateUserWithToken(mockDto);
      }).rejects.toThrowError(
        new UnauthorizedException("authentication error")
      );
      expect(mockUserRepository.findOneById).toHaveBeenCalledTimes(1);
    });

    it("Error: user status가 normal이 아니라면 UnauthorizedException 발생", async () => {
      // given
      const mockUser: Partial<User> = {
        id: 1,
        nickname: "exmaple",
        mbti: "ISTP",
        status: +process.env.USER_STATUS_NEW!,
      };
      const mockUserRepository = {
        findOneById: jest.fn(() => mockUser),
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const authService = container.get<IAuthService>(TYPES.IAuthService);

      await expect(async () => {
        await authService.validateUserWithToken(mockDto);
      }).rejects.toThrowError(
        new UnauthorizedException("authentication error")
      );
      expect(mockUserRepository.findOneById).toHaveBeenCalledTimes(1);
    });

    it("Error: payload의 mbti가 db와 일치하지 않다면 UnauthorizedException 발생", async () => {
      // given
      const NOT_MATCH = "ERROR";
      const mockUser: Partial<User> = {
        id: 1,
        nickname: "exmaple",
        mbti: NOT_MATCH,
        status: +process.env.USER_STATUS_NORMAL!,
      };
      const mockUserRepository = {
        findOneById: jest.fn(() => mockUser),
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const authService = container.get<IAuthService>(TYPES.IAuthService);

      await expect(async () => {
        await authService.validateUserWithToken(mockDto);
      }).rejects.toThrowError(
        new UnauthorizedException("authentication error")
      );
      expect(mockUserRepository.findOneById).toHaveBeenCalledTimes(1);
    });

    it("Error: payload의 nickname이 db와 일치하지 않다면 UnauthorizedException 발생", async () => {
      // given
      const NOT_MATCH = "ERROR";
      const mockUser: Partial<User> = {
        id: 1,
        nickname: NOT_MATCH,
        mbti: "ISTP",
        status: +process.env.USER_STATUS_NORMAL!,
      };
      const mockUserRepository = {
        findOneById: jest.fn(() => mockUser),
      };
      container.unbind(TYPES.IUserRepository);
      container.bind(TYPES.IUserRepository).toConstantValue(mockUserRepository);

      const authService = container.get<IAuthService>(TYPES.IAuthService);

      await expect(async () => {
        await authService.validateUserWithToken(mockDto);
      }).rejects.toThrowError(
        new UnauthorizedException("authentication error")
      );
      expect(mockUserRepository.findOneById).toHaveBeenCalledTimes(1);
    });
  });
});
