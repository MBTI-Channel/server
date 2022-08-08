import { ValueTransformer } from "typeorm";
import { ReportTargetType } from "../../../shared/enum.shared";

export class ReportTargetTypeTransformer implements ValueTransformer {
  // entity -> db
  to(type: ReportTargetType) {
    switch (type) {
      case "post":
        return 1;
      case "comment":
        return 2;
    }
  }

  // db -> entity
  from(type: number) {
    switch (type) {
      case 1:
        return "post";
      case 2:
        return "comment";
    }
  }
}
