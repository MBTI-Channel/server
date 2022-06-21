import container from "../../../../src/core/container.core";
import { TYPES } from "../../../../src/core/type.core";
import { NicknameDuplicateCheckDto } from "../../../../src/modules/user/dtos/nickname-duplicate-check.dto";
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

  describe("isExistsNickname", () => {
    const mockDto: NicknameDuplicateCheckDto = {
      nickname: "야옹맨1",
    };
    const mockUser = new User();

    it("Case1: DB에 존재하는 닉네임이라면 true를 리턴한다.", async () => {
      const userService = container.get<IUserService>(TYPES.IUserService);

      const spyFindOne = jest
        .spyOn(userService, "findOne")
        .mockResolvedValue(mockUser);

      const result = await userService.isExistsNickname(mockDto);
      await expect(result).toEqual(true);
    });

    it("Case2: DB에 존재하지 않는 닉네임이라면 false를 리턴한다.", async () => {
      const userService = container.get<IUserService>(TYPES.IUserService);

      const result = await userService.isExistsNickname(mockDto);
      await expect(result).toEqual(false);
    });
  });
});
