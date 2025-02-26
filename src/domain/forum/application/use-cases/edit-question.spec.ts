import { makeQuestion } from "@/test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./error/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "@/test/factories/make-question-attachment";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question: ", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentsRepository,
    );
  });

  it("should be able to edit a question: ", async () => {
    const question = makeQuestion(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(question);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId("1"),
      }),
      makeQuestionAttachment({
        questionId: question.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({
      questionId: question.id.toString(),
      authorId: "author-1",
      content: "content-changed",
      title: "title-changed",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionRepository.items[0].content).toEqual(
      "content-changed",
    );
    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      content: "content-changed",
      title: "title-changed",
    });
    expect(inMemoryQuestionRepository.items).toHaveLength(1);

    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  it("should NOT be able to edit a question: ", async () => {
    const question = makeQuestion(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(question);

    const result = await sut.execute({
      questionId: "question-1",
      authorId: "author-non-authorized",
      content: "content-changed",
      title: "title-changed",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
