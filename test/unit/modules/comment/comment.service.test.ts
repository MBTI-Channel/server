import { TYPES } from "../../../../src/core/types.core";
import { ICommentRepository } from "../../../../src/modules/comment/interfaces/IComment.repository";
import { ICommentService } from "../../../../src/modules/comment/interfaces/IComment.service";
import { INotificationService } from "../../../../src/modules/notifications/interfaces/INotification.service";
import { IPostRepository } from "../../../../src/modules/post/interfaces/IPost.repository";
import { IPostService } from "../../../../src/modules/post/interfaces/IPost.service";
import { User } from "../../../../src/modules/user/entity/user.entity";
import { NotFoundException } from "../../../../src/shared/errors/all.exception";
import { HttpException } from "../../../../src/shared/errors/http.exception";
import { TestContainer } from "../../../test-container";
import { IDatabaseService } from "../../../../src/core/database/interfaces/IDatabase.service";

import { CommentResponseDto } from "../../../../src/modules/comment/dto";
jest.mock("../../../../src/modules/comment/dto");

describe("CommentService Test", () => {
  const testContainer = new TestContainer();

  beforeEach(() => {
    testContainer.init();
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("createComment", () => {
    const mockUser = new User();
    const postId = 1;
    const content = "content";
    const isSecret = true;
    it("Success: 댓글 생성 성공", async () => {
      // given
      const mockPost = {
        isActive: jest.fn(() => true),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      const mockUserRepo = testContainer.mock<ICommentRepository>(
        TYPES.ICommentRepository,
        {
          createComment: jest.fn(() => mockPost),
        }
      );
      const mockPostService = testContainer.mock<IPostService>(
        TYPES.IPostService,
        {
          increaseCommentCount: jest.fn(),
        }
      );
      const mockNotificationService = testContainer.mock<INotificationService>(
        TYPES.INotificationService,
        {
          createByTargetUser: jest.fn(),
        }
      );
      const mockTransaction = await testContainer
        .get<IDatabaseService>(TYPES.IDatabaseService)
        .getTransaction();

      // when
      const result = await testContainer
        .get<ICommentService>(TYPES.ICommentService)
        .createComment(mockUser, postId, content, isSecret);
      // then
      expect(mockUserRepo.createComment).toBeCalledTimes(1);
      expect(mockPostService.increaseCommentCount).toBeCalledTimes(1);
      expect(mockNotificationService.createByTargetUser).toBeCalledTimes(1);
      expect(mockTransaction.commitTransaction).toBeCalledTimes(1);
      expect(result).toEqual(expect.any(CommentResponseDto));
    });

    it("Error: 존재하지 않는 post id, NotFoundError 발생", async () => {
      // given
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => false),
      });

      // when, then
      expect(async () => {
        await testContainer
          .get<ICommentService>(TYPES.ICommentService)
          .createComment(mockUser, postId, content, isSecret);
      }).rejects.toThrowError(new NotFoundException("not exists post"));
    });

    it("Error: comment count update 도중 삭제된 post id, HttpException 발생", async () => {
      // given
      const mockPost = {
        isActive: jest.fn(() => true),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      testContainer.mock<ICommentRepository>(TYPES.ICommentRepository, {
        createComment: jest.fn(() => true),
      });
      const mockPostService = testContainer.mock<IPostService>(
        TYPES.IPostService,
        {
          increaseCommentCount: jest.fn().mockImplementation(() => {
            throw new Error("업데이트 도중 삭제됨");
          }),
        }
      );
      const mockTransaction = await testContainer
        .get<IDatabaseService>(TYPES.IDatabaseService)
        .getTransaction();

      // when, then
      expect(mockPostService.increaseCommentCount).toThrowError(
        new Error("업데이트 도중 삭제됨")
      );
      await expect(async () => {
        await testContainer
          .get<ICommentService>(TYPES.ICommentService)
          .createComment(mockUser, postId, content, isSecret);
      }).rejects.toThrowError(
        new HttpException("1", "업데이트 도중 삭제됨", 1)
      );
      expect(mockTransaction.rollbackTransaction).toBeCalledTimes(1);
    });
  });
});
