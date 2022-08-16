import { UpdateLog } from "../entity/update-log.entity";

export interface IUpdateLogRepository {
  //create(user: User, type: string, before: string, after: string): Promise<UpdateLog>;
  findLastOfTypeMbtiByUserId(userId: number): Promise<UpdateLog | null>;
  findLastOfTypeNicknameByUserId(userId: number): Promise<UpdateLog | null>;
}
