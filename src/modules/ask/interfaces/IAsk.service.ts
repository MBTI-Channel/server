import { User } from "../../user/entity/user.entity";
import { AskResponseDto } from "../dto/ask-response.dto";

export interface IAskService {
  create(
    user: User,
    title: string,
    content: string,
    imageUrl: string,
    email: string
  ): Promise<AskResponseDto>;
}
