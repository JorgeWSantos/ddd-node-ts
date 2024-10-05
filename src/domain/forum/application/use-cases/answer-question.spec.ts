import { AnswerQuestionsUseCase } from "./answer-question";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: AnswerQuestionsUseCase;

describe("Create Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new AnswerQuestionsUseCase(inMemoryAnswerRepository);
  });

  it("should be able to create a answer: ", async () => {
    const { answer } = await sut.execute({
      content: "teste",
      instructorId: "1",
      questionId: "2",
    });

    expect(answer.id).toBeTruthy();
    expect(inMemoryAnswerRepository.items[0].id).toEqual(answer.id);
  });
});
