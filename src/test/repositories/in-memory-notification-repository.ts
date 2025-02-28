import { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = [];

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) return null;

    return notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const notificationIndex = this.items.findIndex(
      (item) => item.id.toString() === notification.id.toString(),
    );

    this.items[notificationIndex] = notification;
  }
}
