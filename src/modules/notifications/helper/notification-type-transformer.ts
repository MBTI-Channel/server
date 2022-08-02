import { ValueTransformer } from "typeorm";
import { NotificationType } from "../../../shared/type.shared";

export class NotificationTypeTransformer implements ValueTransformer {
  // entity -> db
  to(type: NotificationType) {
    switch (type) {
      case "comment":
        return 1;
      case "reply":
        return 2;
      case "likes":
        return 3;
      case "trend":
        return 4;
      case "notice":
        return 5;
    }
  }
  // db -> entity
  from(type: number) {
    switch (type) {
      case 1:
        return "comment";
      case 2:
        return "reply";
      case 3:
        return "likes";
      case 4:
        return "trend";
      case 5:
        return "notice";
    }
  }
}
