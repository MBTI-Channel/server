import { ObjectType, QueryRunner, Repository } from "typeorm";

export interface IDatabaseService {
  getRepository(entity: ObjectType<any>): Promise<Repository<any>>;
  getTransaction(): Promise<QueryRunner>;
  init(): Promise<void>;
}
