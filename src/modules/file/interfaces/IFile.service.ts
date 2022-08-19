import { FileTargetType } from "../../../shared/enum.shared";

export interface IFileService {
  create(
    targetType: FileTargetType,
    targetId: number,
    filesUrl: string[]
  ): Promise<void>;
  // delete(post: Post, files_url: string[]): Promise<void>;
}
