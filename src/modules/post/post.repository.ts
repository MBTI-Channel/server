import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";

@injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async createEntity(
    categoryId: number,
    isSecret: boolean,
    title: string,
    content: string,
    userMbti: string,
    userNickname: string
  ) {
    const repository = await this._database.getRepository(Post);
    const postEntity = await repository.create({
      categoryId,
      isSecret,
      title,
      content,
      userMbti,
      userNickname,
    });
    return postEntity;
  }

  public async create(postEntity: Post) {
    const repository = await this._database.getRepository(Post);

    const post = await repository.save(postEntity);
    return post;
  }
}
