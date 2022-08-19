import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { File } from "./entity/file.entity";
import { IFileRepository } from "./interfaces/IFile.repository";

@injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async create(fileEntity: File): Promise<void> {
    const repository = await this._database.getRepository(File);
    await repository.save(fileEntity);
  }
}
