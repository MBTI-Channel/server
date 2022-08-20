import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { FileTargetType } from "../../shared/enum.shared";
import { File } from "./entity/file.entity";
import { IFileRepository } from "./interfaces/IFile.repository";

@injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async create(fileEntities: File[]): Promise<void> {
    const repository = await this._database.getRepository(File);
    await repository.save(fileEntities);
  }

  public async findFilesId(
    targetType: FileTargetType,
    targetId: number
  ): Promise<number[] | null> {
    const repository = await this._database.getRepository(File);
    return await repository.find({
      select: ["id"],
      where: { targetType, targetId },
    });
  }

  public async remove(filesId: number[]): Promise<void> {
    const repository = await this._database.getRepository(File);
    await repository.update(filesId, {
      isActive: false,
    } as QueryDeepPartialEntity<File>);
  }
}
