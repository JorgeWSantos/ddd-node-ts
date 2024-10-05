import { CreateQuestionUseCase } from "./create-question";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";

const fakeQuestionRepository: QuestionRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (question: Question) => {},
};

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: CreateQuestionUseCase;

describe("Create Question: ", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
  });

  it("should be able to create a question: ", async () => {
    const { question } = await sut.execute({
      content: "teste",
      authorId: "1",
      title: "teste de question",
    });

    expect(question.id).toBeTruthy();
  });
});
