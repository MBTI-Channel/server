import { Survey } from "../entity/survey.entity";

export interface ISurveyRepository {
  create(surveyEntity: Survey): Promise<Survey>;
}
