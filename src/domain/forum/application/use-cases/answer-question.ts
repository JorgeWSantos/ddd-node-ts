import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { Either, right } from "@/core/either";

interface AnswerQuestionsUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

type AnswerQuestionsUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionsUseCase {
  constructor(private answersRepository: AnswerRepository) { }

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionsUseCaseRequest): Promise<AnswerQuestionsUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
