import { TYPES } from "../../../../src/core/types.core";
import { IUserRepository } from "../../../../src/modules/user/interfaces/IUser.repository";
import { IUserService } from "../../../../src/modules/user/interfaces/IUser.service";
import { TestContainer } from "../../../test-container";

describe("UserService Test", () => {
  const testContainer = new TestContainer();

  beforeEach(() => {
    testContainer.init();
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("isExistsNickname", () => {
    it("Case 1: 존재하는 닉네임이라면 true를 리턴한다.", async () => {
      // given
      const nickname = "TEST";
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneByNickname: () => true,
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .isExistsNickname(nickname);

      // then
      expect(result).toEqual(true);
    });

    it("Case 2: 존재하지 않는 닉네임이라면 false를 리턴한다.", async () => {
      // given
      const nickname = "TEST";
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneByNickname: () => null,
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .isExistsNickname(nickname);

      // then
      expect(result).toEqual(false);
    });
  });

  describe("isValid", () => {
    it("Case 1: user가 존재하고, 활동 상태라면 true를 리턴한다.", async () => {
      // given
      const userId = 1;
      const mockUser = {
        isActive: () => true,
      };
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneStatus: () => mockUser,
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .isValid(userId);

      // then
      expect(result).toEqual(true);
    });

    it("Case 2: 존재하지 않는 user id라면 false를 리턴한다.", async () => {
      // given
      const userId = 1;
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneStatus: () => null,
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .isValid(userId);

      // then
      expect(result).toEqual(false);
    });

    it("Case 3: user가 활동 가능 상태가 아니라면 false를 리턴한다.", async () => {
      // given
      const userId = 1;
      const mockUser = {
        isActive: () => false,
      };
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneStatus: () => mockUser,
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .isValid(userId);

      // then
      expect(result).toEqual(false);
    });
  });
});
