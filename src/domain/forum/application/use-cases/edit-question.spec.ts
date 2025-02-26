import { makeQuestion } from "@/test/factories/make-question";
import { EditQuestionUseCase } from "./edit-question";
import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "./error/not-allowed-error";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: EditQuestionUseCase;

describe("Edit Question: ", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionRepository);
  });

  it("should be able to edit a question: ", async () => {
    const question = makeQuestion(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: "author-1",
      content: "content-changed",
      title: "title-changed",
    });

    expect(inMemoryQuestionRepository.items[0].content).toEqual(
      "content-changed",
    );
    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      content: "content-changed",
      title: "title-changed",
    });
    expect(inMemoryQuestionRepository.items).toHaveLength(1);
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
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
