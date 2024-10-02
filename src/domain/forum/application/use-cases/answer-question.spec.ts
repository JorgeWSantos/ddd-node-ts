import { AnswerQuestionsUseCase } from "./answer-question";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

const fakeAnswersRepository: AnswersRepository = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (answer: Answer) => {},
};
test("create an answer: ", () => {
  const answerQuestion = new AnswerQuestionsUseCase(fakeAnswersRepository);

  const answer = answerQuestion.execute({
    content: "teste",
    instructorId: "1",
    questionId: "2",
  });

  expect(answer).toBeTruthy();
});
