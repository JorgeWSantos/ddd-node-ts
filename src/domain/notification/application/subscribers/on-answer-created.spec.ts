import { makeAnswer } from "@/test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

describe("On Answer created", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    );
  });
  it("should send a notification when an answer is created", async () => {
    const onAnswerCreated = new OnAnswerCreated();

    const answer = makeAnswer();

    await inMemoryAnswerRepository.create(answer);
  });
});
