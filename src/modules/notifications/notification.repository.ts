import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { INotificationRepository } from "./interfaces/INotification.repository";
import { Notification } from "./entity/notification.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

@injectable()
export class NotificationtRepository implements INotificationRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService
  ) {}

  async create(entity: Notification): Promise<void> {
    const repository = await this._database.getRepository(Notification);
    await repository.save(entity);
  }

  async findOneById(id: number): Promise<Notification> {
    const repository = await this._database.getRepository(Notification);
    return repository.findOne({ where: { id } });
  }

  async update(id: number, payload: Partial<Notification>) {
    const repository = await this._database.getRepository(Notification);
    return await repository
      .update(id, payload as QueryDeepPartialEntity<Notification>)
      .then(async () => await repository.findOne({ where: { id } }));
  }
}
