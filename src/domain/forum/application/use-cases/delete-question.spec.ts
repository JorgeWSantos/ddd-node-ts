import { makeQuestion } from "@/test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./error/not-allowed-error";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question: ", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository);
  });

  it("should be able to delete a question: ", async () => {
    const question = makeQuestion(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(question);

    await sut.execute({ questionId: "question-1", authorId: "author-1" });

    expect(inMemoryQuestionRepository.items).toEqual([]);
    expect(inMemoryQuestionRepository.items).toHaveLength(0);
  });

  it("should NOT be able to delete a question: ", async () => {
    const question = makeQuestion(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(question);

    const result = await sut.execute({
      questionId: "question-1",
      authorId: "author-non-authorized",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
