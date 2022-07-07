import container from "../../../../src/core/container.core";
import { TYPES } from "../../../../src/core/type.core";
import { ICommentService } from "../../../../src/modules/comment/interfaces/IComment.service";
import { User } from "../../../../src/modules/user/entity/user.entity";
import { NotFoundException } from "../../../../src/shared/errors/all.exception";

describe("CommentService ", () => {
  const mockUser = {};
  const mockPostId = 1;
  const mockContent = "나는 댓글이다옹";
  const mockIsSecret = true;

  beforeEach(() => {
    // 각 단위 테스트가 다른 단위 테스트를 중단하지 않고 수정할 수 있도록 스냅샷 생성
    container.snapshot();
  });

  afterEach(() => {
    // 각 단위 테스트가 애플리케이션 컨테이너의 새 복사본을 가져오도록 마지막 스냅샷으로 복원
    container.restore();
  });

  describe("createComment", () => {
    it("Success: 존재하는 post id, 댓글 생성", async () => {
      //given
      const mockComment = "";
      const mockCommentResponseDto = "";
      const mockPostRepository = {
        findOneById: () => true,
      };
      container.unbind(TYPES.IPostRepository);
      container.bind(TYPES.IPostRepository).toConstantValue(mockPostRepository);

      const mockCommentRepository = {
        createComment: () => mockComment,
      };
      container.unbind(TYPES.ICommentRepository);
      container
        .bind(TYPES.ICommentRepository)
        .toConstantValue(mockCommentRepository);

      const commentService = container.get<ICommentService>(
        TYPES.ICommentService
      );
      jest
        .spyOn(commentService as any, "_toCommentResponseDto")
        .mockReturnValue(mockCommentResponseDto);

      //when
      const result = await commentService.createComment(
        mockUser as User,
        mockPostId,
        mockContent,
        mockIsSecret
      );

      //then
      expect(result).toBe(mockCommentResponseDto);
    });

    it("Error: 존재하지 않는 post id, NotFoundError 발생", async () => {
      //given
      const mockPostRepository = {
        findOneById: () => null,
      };
      container.unbind(TYPES.IPostRepository);
      container.bind(TYPES.IPostRepository).toConstantValue(mockPostRepository);

      const commentService = container.get<ICommentService>(
        TYPES.ICommentService
      );

      //when, then
      await expect(async () => {
        await commentService.createComment(
          mockUser as User,
          mockPostId,
          mockContent,
          mockIsSecret
        );
      }).rejects.toThrowError(new NotFoundException("not exists post"));
    });
  });
});
