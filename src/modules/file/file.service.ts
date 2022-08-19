import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { FileTargetType } from "../../shared/enum.shared";
import { Logger } from "../../shared/utils/logger.util";
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

  public async create(
    targetType: FileTargetType,
    targetId: number,
    filesUrl: string[]
  ): Promise<void> {
    this._log(`create start`);

    let fileEntities: File[] = [];
    filesUrl.map(async (fileUrl) => {
      const extension = fileUrl.split(".")[1];
      fileEntities.push(File.of(targetType, targetId, extension, fileUrl));
    });
    await this._fileRepository.create(fileEntities);
  }
}
