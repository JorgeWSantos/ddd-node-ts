import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { NotAllowedError } from "./error/not-allowed-error";
import { Either, left, right } from "@/core/either";

interface DeleteAnswersUseCaseRequest {
  answersId: string;
  authorId: string;
}

type DeleteAnswersUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    answersId,
    authorId,
  }: DeleteAnswersUseCaseRequest): Promise<DeleteAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findById(answersId);

    if (!answers) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answers.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answerRepository.delete(answers);

    return right({});
  }
}
