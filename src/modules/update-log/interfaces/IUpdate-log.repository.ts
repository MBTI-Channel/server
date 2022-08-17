import { UpdateLog } from "../entity/update-log.entity";

export interface IUpdateLogRepository {
  create(entity: UpdateLog): Promise<UpdateLog>;
  findLastOfTypeMbtiByUserId(userId: number): Promise<UpdateLog | null>;
  findLastOfTypeNicknameByUserId(userId: number): Promise<UpdateLog | null>;
}
