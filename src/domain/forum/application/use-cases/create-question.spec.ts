import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: CreateQuestionUseCase;

describe("Create Question: ", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
  });

  it("should be able to create a question: ", async () => {
    const result = await sut.execute({
      content: "teste",
      authorId: "1",
      title: "teste de question",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question);
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });
});
