import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { Survey } from "./entity/survey.entity";
import { ISurveyRepository } from "./interfaces/ISurvey.repository";

@injectable()
export class SurveyRepository implements ISurveyRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async create(surveyEntity: Survey): Promise<Survey> {
    const repository = await this._database.getRepository(Survey);
    const post = await repository.save(surveyEntity);
    return post;
  }

  public async update(id: number, payload: Partial<Survey>): Promise<Survey> {
    const repository = await this._database.getRepository(Survey);
    return await repository
      .update(id, payload as QueryDeepPartialEntity<Survey>)
      .then(async () => await repository.findOne({ where: { id } }));
  }

  public async findOneByUser(
    userId: number,
    postId: number
  ): Promise<Survey | null> {
    const repository = await this._database.getRepository(Survey);
    const survey = await repository.findOne({ where: { userId, postId } });
    return survey;
  }
}
