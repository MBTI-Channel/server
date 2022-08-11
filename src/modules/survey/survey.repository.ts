import { inject, injectable } from "inversify";
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
}
