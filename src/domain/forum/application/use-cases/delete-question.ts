import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { NotAllowedError } from "./error/not-allowed-error";
import { Either, left, right } from "@/core/either";

interface DeleteQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) { }

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionRepository.delete(question);

    return right({});
  }
}
