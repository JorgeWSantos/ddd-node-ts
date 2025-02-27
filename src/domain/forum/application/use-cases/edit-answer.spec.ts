import { makeAnswer } from "@/test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/error/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "@/test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentsRepository,
    );
  });

  it("should be able to edit a answer: ", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "author-1",
      content: "content-changed",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryAnswerRepository.items[0].content).toEqual(
      "content-changed",
    );
    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: "content-changed",
    });
    expect(inMemoryAnswerRepository.items).toHaveLength(1);
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  it("should NOT be able to edit a answer: ", async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswerRepository.create(answer);

    const result = await sut.execute({
      answerId: "answer-1",
      authorId: "author-non-authorized",
      content: "content-changed",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
