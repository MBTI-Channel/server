import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { INotificationRepository } from "./interfaces/INotification.repository";
import { INotificationService } from "./interfaces/INotification.service";
import { NotificationtRepository } from "./notification.repository";
import { NotificationService } from "./notification.service";

export const notificationModule = new ContainerModule((bind) => {
  bind<INotificationService>(TYPES.INotificationService).to(
    NotificationService
  );
  bind<INotificationRepository>(TYPES.INotificationRepository).to(
    NotificationtRepository
  );
});
