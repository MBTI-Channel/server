import { File } from "../entity/file.entity";

export interface IFileRepository {
  create(fileEntity: File): Promise<void>;
  // findOneByIdAndUrl(postId: number, fileUrl: string): Promise<File | null>;
  // delete(fileEntity: File): Promise<void>;
}
