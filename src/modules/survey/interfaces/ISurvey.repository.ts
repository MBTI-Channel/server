import { Survey } from "../entity/survey.entity";

export interface ISurveyRepository {
  create(surveyEntity: Survey): Promise<Survey>;
  update(id: number, payload: Partial<Survey>): Promise<Survey>;
  findOneByUser(userId: number, postId: number): Promise<Survey | null>;
}
