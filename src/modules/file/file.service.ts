import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { Logger } from "../../shared/utils/logger.util";
import { Post } from "../post/entity/post.entity";
import { File } from "./entity/file.entity";
import { IFileRepository } from "./interfaces/IFile.repository";
import { IFileService } from "./interfaces/IFile.service";

@injectable()
export class FileService implements IFileService {
  constructor(
    @inject(TYPES.IFileRepository)
    private readonly _fileRepository: IFileRepository,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}
  private _log(message: string) {
    this._logger.trace(`[FileService] ${message}`);
  }

  public async create(post: Post, filesUrl: string[]): Promise<void> {
    this._log(`create start`);

    filesUrl.map(async (fileUrl) => {
      const fileEntity = File.of(post, fileUrl);
      await this._fileRepository.create(fileEntity);
    });
  }
}
