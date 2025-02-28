import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { makeNotification } from "@/test/factories/make-notification";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/error/not-allowed-error";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe("Read Notification: ", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
  });

  it("should be able to read a notification: ", async () => {
    const notification = makeNotification();

    inMemoryNotificationRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  it("should NOT be able to read a notification from another user: ", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId("recipient-1"),
    });

    inMemoryNotificationRepository.create(notification);

    const result = await sut.execute({
      recipientId: "recipient-invalid",
      notificationId: notification.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
