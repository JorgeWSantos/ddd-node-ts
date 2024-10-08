import { makeAnswer } from "@/test/factories/make-answer";
import { DeleteAnswersUseCase } from "./delete-answer";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: DeleteAnswersUseCase;

describe("Delete Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new DeleteAnswersUseCase(inMemoryAnswerRepository);
  });

  it("should be able to delete a answer: ", async () => {
    const answers = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answers-1"),
    );

    await inMemoryAnswerRepository.create(answers);

    await sut.execute({ answersId: "answers-1", authorId: "author-1" });

    expect(inMemoryAnswerRepository.items).toEqual([]);
    expect(inMemoryAnswerRepository.items).toHaveLength(0);
  });

  it("should NOT be able to delete a answers: ", async () => {
    const answers = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answers-1"),
    );

    await inMemoryAnswerRepository.create(answers);

    expect(() =>
      sut.execute({
        answersId: "answers-1",
        authorId: "author-non-authorized",
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
