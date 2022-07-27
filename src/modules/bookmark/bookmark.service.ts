import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import {
  BadReqeustException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../../shared/errors/all.exception";
import { Logger } from "../../shared/utils/logger.util";
import { Post } from "../post/entity/post.entity";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import { User } from "../user/entity/user.entity";
import { BookmarkResponseDto } from "./dto/bookmark-response.dto";
import { Bookmark } from "./entity/bookmark.entity";
import { IBookmarkRepository } from "./interfaces/IBookmark.repository";
import { IBookmarkService } from "./interfaces/IBookmark.service";

@injectable()
export class BookmarkService implements IBookmarkService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.IBookmarkRepository)
    private readonly _bookmarkRepository: IBookmarkRepository
  ) {}

  async createBookmark(
    targetId: number,
    user: User
  ): Promise<BookmarkResponseDto> {
    this._logger.trace(`[BookmarkService] createBookmark start`);
    // targetId 존재 여부
    const post = await this._postRepository.findOneById(targetId);
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);

    // 이미 되어 있는지 북마크가
    const existedBookmark = await this._bookmarkRepository.findOneByUserAndPost(
      post.id,
      user.id
    );
    if (existedBookmark && existedBookmark.isActive) {
      throw new BadReqeustException(`bookmark already existed`);
    }

    // post type이 mbti일 경우 mbti확인
    if (post.type === Post.typeTo("mbti") && user.mbti !== post.userMbti) {
      throw new ForbiddenException(`user mbti does not match`);
    }

    const bookmarkEntity = Bookmark.of(post, user);
    const bookmark = await this._bookmarkRepository.createBookmark(
      bookmarkEntity
    );

    return new BookmarkResponseDto(bookmark, post);
  }

  async delete(user: User, id: number): Promise<void> {
    this._logger.trace(`[BookmarkService] delete start`);
    // 북마크 검증
    const bookmark = await this._bookmarkRepository.findOneById(id);
    if (!bookmark || !bookmark.isActive)
      throw new NotFoundException("not exists bookmark");

    // 권한 확인
    if (bookmark.userId !== user.id)
      throw new ForbiddenException("authorization error");

    this._logger.trace(`[BookmarkService] remove bookmark ${id}`);
    await this._bookmarkRepository.remove(id);
  }
}
