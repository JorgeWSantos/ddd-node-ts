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
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question);
  });
});
