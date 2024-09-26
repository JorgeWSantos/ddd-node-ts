import { AnswerQuestionsUseCase } from './answer-question'
import { AnswersRepository } from '@/domain/repositories/answers-repository'
import { Answer } from '@/domain/entities/answer'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    console.log(answer)
  },
}
test('create an answer: ', () => {
  const answerQuestion = new AnswerQuestionsUseCase(fakeAnswersRepository)

  const answer = answerQuestion.execute({
    content: 'teste',
    instructorId: '1',
    questionId: '2',
  })

  expect(answer).toBeTruthy()
})
