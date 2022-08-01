import { TYPES } from "../../../../src/core/types.core";
import { ICommentRepository } from "../../../../src/modules/comment/interfaces/IComment.repository";
import { ICommentService } from "../../../../src/modules/comment/interfaces/IComment.service";
import { INotificationService } from "../../../../src/modules/notifications/interfaces/INotification.service";
import { IPostRepository } from "../../../../src/modules/post/interfaces/IPost.repository";
import { IPostService } from "../../../../src/modules/post/interfaces/IPost.service";
import { User } from "../../../../src/modules/user/entity/user.entity";
import {
  BadReqeustException,
  NotFoundException,
} from "../../../../src/shared/errors/all.exception";
import { HttpException } from "../../../../src/shared/errors/http.exception";
import { TestContainer } from "../../../test-container";
import { IDatabaseService } from "../../../../src/core/database/interfaces/IDatabase.service";
import {
  CommentResponseDto,
  ReplyResponseDto,
} from "../../../../src/modules/comment/dto";

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

  describe("createReply", () => {
    const mockUser = new User();
    const postId = 1;
    const content = "content";
    const isSecret = true;
    let parentId: number;
    let taggedId: number;

    it("Success: 내가 작성한 부모 댓글에 대한 대댓글 작성. 게시글 작성자에게만 알림 발생", async () => {
      // given
      mockUser.isMy = jest
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      parentId = 1;
      taggedId = 1;
      const postUserId = 1;
      const mockPost = {
        userId: postUserId,
        isActive: jest.fn(() => true),
      };
      const mockComment = {
        isActive: jest.fn(() => true),
        isReply: jest.fn(() => false),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      testContainer.mock<ICommentRepository>(TYPES.ICommentRepository, {
        findOneById: jest.fn(() => mockComment),
        createComment: jest.fn(() => true),
        increaseReplyCount: jest.fn(() => true),
      });
      testContainer.mock<IPostService>(TYPES.IPostService, {
        increaseCommentCount: jest.fn(() => true),
      });
      const mockNotificationServce = testContainer.mock<INotificationService>(
        TYPES.INotificationService,
        {
          createByTargetUser: jest.fn(() => true),
        }
      );

      // when
      const result = await testContainer
        .get<ICommentService>(TYPES.ICommentService)
        .createReply(mockUser, postId, parentId, taggedId, content, isSecret);
      // then
      expect(mockUser.isMy).toBeCalledTimes(2);
      expect(mockNotificationServce.createByTargetUser).toBeCalledWith(
        mockUser,
        postUserId,
        undefined,
        "comment"
      );
      expect(result).toEqual(expect.any(ReplyResponseDto));
    });

    it("Success: 내가 작성한 게시글 대한 대댓글 작성. 대댓글 대상 작성자에게만 알림 발생", async () => {
      // given
      mockUser.isMy = jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      parentId = 1;
      taggedId = 1;
      const postUserId = 1;
      const mockPost = {
        userId: postUserId,
        isActive: jest.fn(() => true),
      };
      const mockComment = {
        isActive: jest.fn(() => true),
        isReply: jest.fn(() => false),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      testContainer.mock<ICommentRepository>(TYPES.ICommentRepository, {
        findOneById: jest.fn(() => mockComment),
        createComment: jest.fn(() => true),
        increaseReplyCount: jest.fn(() => true),
      });
      testContainer.mock<IPostService>(TYPES.IPostService, {
        increaseCommentCount: jest.fn(() => true),
      });
      const mockNotificationServce = testContainer.mock<INotificationService>(
        TYPES.INotificationService,
        {
          createByTargetUser: jest.fn(() => true),
        }
      );

      // when
      const result = await testContainer
        .get<ICommentService>(TYPES.ICommentService)
        .createReply(mockUser, postId, parentId, taggedId, content, isSecret);
      // then
      expect(mockUser.isMy).toBeCalledTimes(2);
      expect(mockNotificationServce.createByTargetUser).toBeCalledWith(
        mockUser,
        undefined,
        undefined,
        "reply"
      );
      expect(result).toEqual(expect.any(ReplyResponseDto));
    });

    it("Error: 존재하지 않는 post id, NotFoundError 발생", async () => {
      // given
      parentId = 1;
      taggedId = 2;
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => false),
      });

      // when, then
      expect(async () => {
        await testContainer
          .get<ICommentService>(TYPES.ICommentService)
          .createReply(mockUser, postId, parentId, taggedId, content, isSecret);
      }).rejects.toThrowError(new NotFoundException("not exists post"));
    });

    it("Error: 존재하지 않는 부모 댓글, NotFoundError 발생", async () => {
      // given
      parentId = 1;
      taggedId = 1;
      const mockPost = {
        isActive: jest.fn(() => true),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      testContainer.mock<ICommentRepository>(TYPES.ICommentRepository, {
        findOneById: jest.fn(() => false),
      });

      // when, then
      expect(async () => {
        await testContainer
          .get<ICommentService>(TYPES.ICommentService)
          .createReply(mockUser, postId, parentId, taggedId, content, isSecret);
      }).rejects.toThrowError(new NotFoundException("not exists comment"));
    });

    it("Error: parent id가 부모 댓글이 아니라면 BadReqeustException 발생", async () => {
      // given
      parentId = 1;
      taggedId = 1;
      const mockPost = {
        isActive: jest.fn(() => true),
      };
      const mockComment = {
        isActive: jest.fn(() => true),
        isReply: jest.fn(() => true),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      testContainer.mock<ICommentRepository>(TYPES.ICommentRepository, {
        findOneById: jest.fn(() => mockComment),
      });

      // when, then
      expect(async () => {
        await testContainer
          .get<ICommentService>(TYPES.ICommentService)
          .createReply(mockUser, postId, parentId, taggedId, content, isSecret);
      }).rejects.toThrowError(
        new BadReqeustException("invalid parent comment id")
      );
    });

    it("Error: 존재하지 않는 대댓글, NotFoundError 발생", async () => {
      // given
      parentId = 1;
      taggedId = 100;
      const mockPost = {
        isActive: jest.fn(() => true),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      testContainer.mock<ICommentRepository>(TYPES.ICommentRepository, {
        findOneById: jest.fn(() => false),
      });

      // when, then
      expect(async () => {
        await testContainer
          .get<ICommentService>(TYPES.ICommentService)
          .createReply(mockUser, postId, parentId, taggedId, content, isSecret);
      }).rejects.toThrowError(new NotFoundException("not exists reply"));
    });

    it("Error: 대댓글의 parentId가 요청 parentId와 다르다면, BadReqeustException 발생", async () => {
      // given
      parentId = 1;
      taggedId = 100;
      const mockPost = {
        isActive: jest.fn(() => true),
      };
      const mockReply = {
        parentId: 99999,
        isActive: jest.fn(() => true),
      };
      testContainer.mock<IPostRepository>(TYPES.IPostRepository, {
        findOneById: jest.fn(() => mockPost),
      });
      testContainer.mock<ICommentRepository>(TYPES.ICommentRepository, {
        findOneById: jest.fn(() => mockReply),
      });

      // when, then
      expect(async () => {
        await testContainer
          .get<ICommentService>(TYPES.ICommentService)
          .createReply(mockUser, postId, parentId, taggedId, content, isSecret);
      }).rejects.toThrowError(
        new BadReqeustException(
          "tagged reply must be in the same comment group"
        )
      );
    });
  });
});
