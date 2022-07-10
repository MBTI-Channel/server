import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { INotificationRepository } from "./interfaces/INotification.repository";
import { Notification } from "./entity/notification.entity";

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
}
