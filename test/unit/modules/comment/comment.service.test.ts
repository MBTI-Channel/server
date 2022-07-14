import container from "../../../../src/core/container.core";
import { TYPES } from "../../../../src/core/type.core";
import { CommentResponseDto } from "../../../../src/modules/comment/dto/all-response.dto";
import { Comment } from "../../../../src/modules/comment/entity/comment.entity";
import { ICommentService } from "../../../../src/modules/comment/interfaces/IComment.service";
import { User } from "../../../../src/modules/user/entity/user.entity";
import { NotFoundException } from "../../../../src/shared/errors/all.exception";

describe("CommentService ", () => {
  beforeEach(() => {
    // 각 단위 테스트가 다른 단위 테스트를 중단하지 않고 수정할 수 있도록 스냅샷 생성
    container.snapshot();
  });

  afterEach(() => {
    // 각 단위 테스트가 애플리케이션 컨테이너의 새 복사본을 가져오도록 마지막 스냅샷으로 복원
    container.restore();
  });

  describe("createComment", () => {
    const mockDataBaseService = {
      getTransaction: () => {
        return {
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          rollbackTransaction: jest.fn(),
          release: jest.fn(),
        };
      },
    };

    it("Success: 존재하는 post id, post의 댓글수 + 1 및 댓글 생성", async () => {
      //given
      const mockUser = {
        isMy: () => true,
      };
      const mockPostId = 1;
      const mockContent = "나는 댓글이다옹";
      const mockIsSecret = true;
      const mockComment = "";
      const mockPost = { isActive: true };
      const mockPostRepository = {
        findOneById: () => {
          return mockPost;
        },
      };
      const mockEntity = {};
      Comment.of = jest.fn().mockReturnValue(mockEntity);
      const mockPostService = {
        increaseCommentCount: () => true,
      };
      const mockNotificationService = {
        createByTargetUser: () => true,
      };
      const mockCommentRepository = {
        createComment: () => mockComment,
      };

      container.unbind(TYPES.IDatabaseService);
      container
        .bind(TYPES.IDatabaseService)
        .toConstantValue(mockDataBaseService);
      container.unbind(TYPES.IPostRepository);
      container.bind(TYPES.IPostRepository).toConstantValue(mockPostRepository);
      container.unbind(TYPES.IPostService);
      container.bind(TYPES.IPostService).toConstantValue(mockPostService);
      container.unbind(TYPES.INotificationService);
      container
        .bind(TYPES.INotificationService)
        .toConstantValue(mockNotificationService);
      container.unbind(TYPES.ICommentRepository);
      container
        .bind(TYPES.ICommentRepository)
        .toConstantValue(mockCommentRepository);

      const commentService = container.get<ICommentService>(
        TYPES.ICommentService
      );

      const spyIncreaseCommentCount = jest.spyOn(
        mockPostService,
        "increaseCommentCount"
      );
      const spyCreateByTargetUser = jest.spyOn(
        mockNotificationService,
        "createByTargetUser"
      );

      //when
      const result = await commentService.createComment(
        mockUser as unknown as User,
        mockPostId,
        mockContent,
        mockIsSecret
      );

      //then
      expect(spyIncreaseCommentCount).toBeCalledTimes(1);
      expect(spyCreateByTargetUser).toBeCalledTimes(1);
      expect(result).toEqual(expect.any(CommentResponseDto));
    });

    it("Error: 존재하지 않는 post id, NotFoundError 발생", async () => {
      //given
      const mockUser = {
        isMy: () => true,
      };
      const mockPostId = 1;
      const mockContent = "나는 댓글이다옹";
      const mockIsSecret = false;
      const mockPostRepository = {
        findOneById: () => null,
      };

      container.unbind(TYPES.IDatabaseService);
      container
        .bind(TYPES.IDatabaseService)
        .toConstantValue(mockDataBaseService);
      container.unbind(TYPES.IPostRepository);
      container.bind(TYPES.IPostRepository).toConstantValue(mockPostRepository);

      const commentService = container.get<ICommentService>(
        TYPES.ICommentService
      );

      //when, then
      await expect(async () => {
        await commentService.createComment(
          mockUser as unknown as User,
          mockPostId,
          mockContent,
          mockIsSecret
        );
      }).rejects.toThrowError(new NotFoundException("not exists post"));
    });
  });
});
