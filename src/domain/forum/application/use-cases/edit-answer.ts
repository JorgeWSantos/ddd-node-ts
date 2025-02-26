import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "../../enterprise/entities/answer";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { NotAllowedError } from "./error/not-allowed-error";
import { Either, left, right } from "@/core/either";

interface EditAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
  content: string;
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) { }

  async execute({
    answerId,
    authorId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    answer.content = content;

    await this.answerRepository.save(answer);

    return right({ answer });
  }
}
