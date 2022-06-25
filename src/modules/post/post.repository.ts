import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../database/interfaces/IDatabase.service";
import { CreatePostDto } from "./dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";

@injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const repository = await this.database.getRepository(Post);
    const post = await repository.create(dto);
    await repository.insert(post);
    return post;
  }
}
