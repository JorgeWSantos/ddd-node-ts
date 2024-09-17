import { expect, test } from "vitest";
import { AnswerQuestionsUseCase } from "./answer-question";
import { Instructor } from "../entities/instructor";
import { Question } from "../entities/question";
import { Student } from "../entities/student";
import { AnswersRepository } from "../repositories/answers-repository";
import { Answer } from "../entities/answer";

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return;
  }
}
test('create an answer: ', () => {
  const answerQuestion = new AnswerQuestionsUseCase(fakeAnswersRepository)

  const instructor = new Instructor('Jorge');
  const student = new Student('Júlia');

  const question = new Question({ title: 'Primeira Dúvida', content: 'Deu pau', authorId: student.id });

  const answer = answerQuestion.execute({ content: 'teste', instructorId: instructor.id, questionId: question.id });

  expect(answer).toBeTruthy()
})