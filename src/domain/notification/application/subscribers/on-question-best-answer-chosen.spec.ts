import { makeAnswer } from "@/test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";
import { InMemoryNotificationRepository } from "@/test/repositories/in-memory-notification-repository";
import { makeQuestion } from "@/test/factories/make-question";
import { MockInstance } from "vitest";
import { waitFor } from "@/test/utils/wait-for";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest,
  ) => Promise<SendNotificationUseCaseResponse>
>;

describe("On question best answer chosen", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    );

    sendNotificationSpy = vi.spyOn(sendNotificationUseCase, "execute");

    new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationUseCase);
  });

  it("should send a notification when an question has new best answer", async () => {
    const question = makeQuestion();

    const answer = makeAnswer({ questionId: question.id });

    await inMemoryQuestionRepository.create(question);
    await inMemoryAnswerRepository.create(answer);

    question.bestAnswerId = answer.id;

    await inMemoryQuestionRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationSpy).toHaveBeenCalled();
    });
  });
});
