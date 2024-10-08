import { makeAnswer } from "@/test/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new EditAnswerUseCase(inMemoryAnswerRepository);
  });

  it("should be able to edit a answer: ", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    const { answer } = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "author-1",
      content: "content-changed",
    });

    expect(answer.content).toEqual("content-changed");
    expect(answer).toMatchObject({
      content: "content-changed",
    });
    expect(inMemoryAnswerRepository.items).toHaveLength(1);
  });

  it("should NOT be able to edit a answer: ", async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityId("author-1") },
      new UniqueEntityId("answer-1"),
    );

    await inMemoryAnswerRepository.create(answer);

    expect(() =>
      sut.execute({
        answerId: "answer-1",
        authorId: "author-non-authorized",
        content: "content-changed",
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
