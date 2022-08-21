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

  public async update(
    targetType: FileTargetType,
    targetId: number,
    filesUrl: string[]
  ): Promise<void> {
    this._log(`update start`);

    const files = await this._fileRepository.findFilesInfo(
      targetType,
      targetId
    );

    let existedFilesUrl: string[] = [];
    if (files) {
      files.map((file) => {
        if (file.isActive) {
          existedFilesUrl.push(file.url);
        }
      });
    }

    // files에 file이 없으면 새로 생성
    let newFilesUrl = filesUrl.filter(
      (file) => !existedFilesUrl.includes(file)
    );

    // files에는 있는데 file에 없으면 삭제
    let removeFilesUrl = existedFilesUrl.filter(
      (file) => !filesUrl.includes(file)
      // TODO: 삭제 로직 구현 생각..
    );

    if (newFilesUrl) await this.create(targetType, targetId, newFilesUrl);
  }

  public async remove(
    targetType: FileTargetType,
    targetId: number
  ): Promise<void> {
    this._log(`remove start`);

    const files = await this._fileRepository.findFilesInfo(
      targetType,
      targetId
    );

    if (files) {
      await this._fileRepository.remove(files.map((file) => file.id));
    }
  }
}
