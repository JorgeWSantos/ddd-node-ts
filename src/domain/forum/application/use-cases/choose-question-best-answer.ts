import { AnswerRepository } from "../repositories/answer-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { NotAllowedError } from "./error/not-allowed-error";

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository,
  ) { }

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) return left(new NotAllowedError());

    if (question?.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return right({
      question,
    });
  }
}
