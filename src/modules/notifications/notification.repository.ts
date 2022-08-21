import { inject, injectable } from "inversify";
import { IsNull } from "typeorm";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { INotificationRepository } from "./interfaces/INotification.repository";
import { Notification } from "./entity/notification.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { GetAllNotificationsDto } from "./dto";

@injectable()
export class NotificationtRepository implements INotificationRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly _database: IDatabaseService
  ) {}

  public async create(entity: Notification): Promise<void> {
    const repository = await this._database.getRepository(Notification);
    await repository.save(entity);
  }

  public async findOneById(id: number): Promise<Notification> {
    const repository = await this._database.getRepository(Notification);
    return repository.findOne({ where: { id } });
  }

  public async findAllByUserId(
    userId: number,
    pageOptionsDto: GetAllNotificationsDto
  ): Promise<[Notification[], number]> {
    const repository = await this._database.getRepository(Notification);
    const queryBuilder = repository
      .createQueryBuilder("notification")
      .where("notification.userId = :userId", { userId })
      .andWhere("notification.id >= :startId", {
        startId: pageOptionsDto.startId,
      })
      .take(pageOptionsDto.maxResults)
      .orderBy(`notification.createdAt`, "ASC");

    if (pageOptionsDto.all)
      queryBuilder.andWhere("notification.readAt IS NULL");

    return queryBuilder.getManyAndCount();
  }

  public async update(id: number, payload: Partial<Notification>) {
    const repository = await this._database.getRepository(Notification);
    return await repository
      .update(id, payload as QueryDeepPartialEntity<Notification>)
      .then(async () => await repository.findOne({ where: { id } }));
  }

  public async updateAllUnread(userId: number) {
    const repository = await this._database.getRepository(Notification);
    const { affected } = await repository.update({ userId, readAt: IsNull() }, {
      readAt: new Date(),
    } as QueryDeepPartialEntity<Notification>);
    return affected!; // update된 컬럼수
  }
}
