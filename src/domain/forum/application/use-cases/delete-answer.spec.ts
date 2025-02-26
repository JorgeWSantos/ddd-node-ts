import { makeAnswer } from "@/test/factories/make-answer";
import { DeleteAnswersUseCase } from "./delete-answer";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./error/not-allowed-error";
import { makeAnswerAttachment } from "@/test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: DeleteAnswersUseCase;

describe("Delete Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new DeleteAnswersUseCase(inMemoryAnswerRepository);
  });

  it("should be able to delete a answer: ", async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answers-1"),
    );

    await inMemoryAnswerRepository.create(answer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({ answersId: "answers-1", authorId: "author-1" });

    expect(inMemoryAnswerRepository.items).toEqual([]);
    expect(inMemoryAnswerRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
  });

  it("should NOT be able to delete a answer: ", async () => {
    const answers = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answers-1"),
    );

    await inMemoryAnswerRepository.create(answers);
    const result = await sut.execute({
      answersId: "answers-1",
      authorId: "author-non-authorized",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
