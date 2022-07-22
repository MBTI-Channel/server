import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { Ask } from "./entity/ask.entity";
import { IAskRepository } from "./interfaces/IAsk.repository";

@injectable()
export class AskRepository implements IAskRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  async create(askEntity: Ask): Promise<Ask> {
    const repository = await this._database.getRepository(Ask);
    const ask = await repository.save(askEntity);
    return ask;
  }
}
