import { CreateQuestionUseCase } from "./create-question";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

const fakeQuestionRepository: QuestionRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (question: Question) => { },
};
test("create an question: ", async () => {
  const createQuestion = new CreateQuestionUseCase(fakeQuestionRepository);

  const { question } = await createQuestion.execute({
    content: "teste",
    authorId: "1",
    title: "teste de question",
  });

  expect(question.id).toBeTruthy();
});
