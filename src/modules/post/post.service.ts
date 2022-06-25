import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../utils/logger.util";
import { CreatePostDto } from "./dto";
import { Post } from "./entity/post.entity";
import { IPostRepository } from "./interfaces/IPost.repository";
import { IPostService } from "./interfaces/IPost.service";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.IPostRepository)
    private readonly postRepository: IPostRepository
  ) {}

  public async create(dto: CreatePostDto): Promise<Post> {
    return await this.postRepository.create(dto);
  }
}
