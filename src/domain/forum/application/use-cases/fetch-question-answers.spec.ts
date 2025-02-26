import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { makeAnswer } from "@/test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers: ", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
  });

  it("should be able to fetch question answers: ", async () => {
    inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-1") }),
    );
    inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-1") }),
    );
    inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityId("question-1") }),
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("should be able to fetch paginated question answers", async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityId("question-1") }),
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
