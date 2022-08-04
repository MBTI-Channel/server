import { TYPES } from "../../../../src/core/types.core";
import { IUserRepository } from "../../../../src/modules/user/interfaces/IUser.repository";
import { IUserService } from "../../../../src/modules/user/interfaces/IUser.service";
import { ConflictException } from "../../../../src/shared/errors/all.exception";
import { TestContainer } from "../../../test-container";

describe("UserService Test", () => {
  const testContainer = new TestContainer();

  beforeEach(() => {
    testContainer.init();
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("checkDuplicateNickname", () => {
    it("Success: 사용가능한 닉네임이라면, undefined 리턴", async () => {
      // given
      const nickname = "TEST";
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneByNickname: jest.fn(() => null),
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .checkDuplicateNickname(nickname);

      // then
      expect(result).toBe(undefined);
    });

    it("Error: 이미 존재하는 닉네임이라면, ConflictException 발생", async () => {
      // given
      const nickname = "TEST";
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneByNickname: jest.fn(() => true),
      });

      // when, then
      expect(async () => {
        await testContainer
          .get<IUserService>(TYPES.IUserService)
          .checkDuplicateNickname(nickname);
      }).rejects.toThrowError(new ConflictException("already exists nickname"));
    });
  });

  describe("isValid", () => {
    it("Case 1: user가 존재하고, 활동 상태라면 true를 리턴한다.", async () => {
      // given
      const userId = 1;
      const mockUser = {
        isActive: jest.fn(() => true),
      };
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneStatus: jest.fn(() => mockUser),
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .isValid(userId);

      // then
      expect(result).toEqual(true);
      expect(mockUser.isActive).toBeCalledTimes(1);
    });

    it("Case 2: 존재하지 않는 user id라면 false를 리턴한다.", async () => {
      // given
      const userId = 1;
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneStatus: jest.fn(() => null),
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
        isActive: jest.fn(() => false),
      };
      testContainer.mock<IUserRepository>(TYPES.IUserRepository, {
        findOneStatus: jest.fn(() => mockUser),
      });

      // when
      const result = await testContainer
        .get<IUserService>(TYPES.IUserService)
        .isValid(userId);

      // then
      expect(result).toEqual(false);
      expect(mockUser.isActive).toBeCalledTimes(1);
    });
  });
});
