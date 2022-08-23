import { FileTargetType } from "../../../shared/enum.shared";
import { File } from "../entity/file.entity";

export interface IFileRepository {
  create(fileEntity: File[]): Promise<void>;
  findFilesInfo(
    targetType: FileTargetType,
    targetId: number
  ): Promise<File[] | null>;
  remove(filesId: number[]): Promise<void>;
}
