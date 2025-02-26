import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerQuestionsUseCase } from "./answer-question";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: AnswerQuestionsUseCase;

describe("Create Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new AnswerQuestionsUseCase(inMemoryAnswerRepository);
  });

  it("should be able to create a answer: ", async () => {
    const result = await sut.execute({
      content: "teste",
      instructorId: "1",
      questionId: "2",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerRepository.items[0].id).toEqual(
      result.value?.answer.id,
    );
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });
});
