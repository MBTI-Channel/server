import container from "../../../../src/core/container.core";
import { TYPES } from "../../../../src/core/type.core";
import { NotFoundException } from "../../../../src/errors/all.exception";
import { LoginDto } from "../../../../src/modules/auth/dtos/login.dto";
import { IAuthService } from "../../../../src/modules/auth/interfaces/IAuth.service";

describe("AuthService ", () => {
  const mockDto: LoginDto = {
    provider: "naver",
    providerId: "exmaple",
  };
  const mockAccessToken: string = "accessToken";
  const mockRefreshToken: string = "refreshToken";

  beforeEach(() => {
    // 각 단위 테스트가 다른 단위 테스트를 중단하지 않고 수정할 수 있도록 스냅샷 생성
    container.snapshot();
  });

  afterEach(() => {
    // 각 단위 테스트가 애플리케이션 컨테이너의 새 복사본을 가져오도록 마지막 스냅샷으로 복원
    container.restore();
  });

  describe("login", () => {
    it("Success: DB에 존재하는 user라면 { user, accessToken, refreshToken } 리턴한다.", async () => {
      const mockUserService = {
        findOne: () => {
          return true;
        },
      };
      container.unbind(TYPES.IUserService);
      container.bind(TYPES.IUserService).toConstantValue(mockUserService);
      let authSerivce = container.get<IAuthService>(TYPES.IAuthService);

      const spyGenerateAccessToken = jest
        .spyOn(authSerivce, "generateAccessToken")
        .mockResolvedValue(mockAccessToken);
      const spyGenerateRefreshToken = jest
        .spyOn(authSerivce, "generateRefreshToken")
        .mockResolvedValue(mockRefreshToken);

      const result = await authSerivce.login(mockDto);

      expect(spyGenerateAccessToken).toHaveBeenCalledTimes(1);
      expect(spyGenerateRefreshToken).toHaveBeenCalledTimes(1);
      await expect(result).toEqual({
        user: true,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });

    it("Error: DB에 존재하지 않는 user라면 NotFoundException 발생", async () => {
      const mockUserService = {
        findOne: () => {
          return null;
        },
      };

      container.unbind(TYPES.IUserService);
      container.bind(TYPES.IUserService).toConstantValue(mockUserService);
      const authSerivce = container.get<IAuthService>(TYPES.IAuthService);

      await expect(async () => {
        await authSerivce.login(mockDto);
      }).rejects.toThrowError(new NotFoundException("not exists user"));
    });
  });
});
