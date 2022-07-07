import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Category } from "../category/entity/category.entity";
import { User } from "../user/entity/user.entity";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";

@injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async createEntity(
    isSecret: boolean,
    title: string,
    content: string,
    userMbti: string,
    userNickname: string,
    category: Category,
    user: User
  ) {
    const repository = await this._database.getRepository(Post);
    const postEntity = await repository.create({
      isSecret,
      title,
      content,
      userMbti,
      userNickname,
      category,
      user,
    });
    return postEntity;
  }

  public async create(postEntity: Post) {
    const repository = await this._database.getRepository(Post);
    const post = await repository.save(postEntity);
    return post;
  }

  public async findOneById(id: number): Promise<Post | null> {
    const repository = await this._database.getRepository(Post);
    const post = await repository.findOne({ where: { id } });
    return post;
  }

  public async increaseCommentCount(id: number): Promise<boolean> {
    const repository = await this._database.getRepository(Post);
    const result = await repository.increment({ id }, "commentCount", 1);
    if (result.affected === 1) return true;
    return false;
  }
}
