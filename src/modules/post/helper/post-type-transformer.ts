import { ValueTransformer } from "typeorm";
import { PostType } from "../../../shared/enum.shared";

export class PostTypeTransformer implements ValueTransformer {
  // entity -> db
  to(type: PostType) {
    switch (type) {
      case "post":
        return 1;
      case "mbti":
        return 2;
      case "survey":
        return 3;
      case "notice":
        return 4;
      default: // typeTo undefined 막기 위해 추가
        return 0;
    }
  }

  // db -> entity
  from(type: number) {
    switch (type) {
      case 1:
        return "post";
      case 2:
        return "mbti";
      case 3:
        return "survey";
      case 4:
        return "notice";
    }
  }
}
