import { ValueTransformer } from "typeorm";
import { FileTargetType } from "../../../shared/enum.shared";

export class FileTargetTypeTransformer implements ValueTransformer {
  // entity -> db
  to(type: FileTargetType) {
    switch (type) {
      case "user":
        return 1;
      case "post":
        return 2;
      case "comment":
        return 3;
    }
  }

  // db -> entity
  from(type: number) {
    switch (type) {
      case 1:
        return "user";
      case 2:
        return "post";
      case 3:
        return "comment";
    }
  }
}
