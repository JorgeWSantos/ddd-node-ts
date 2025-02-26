import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "../../enterprise/entities/question";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./error/resource-not-found-error";
import { NotAllowedError } from "./error/not-allowed-error";

interface EditQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  content: string;
  title: string;
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class EditQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) { }

  async execute({
    questionId,
    authorId,
    content,
    title,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.title = title;
    question.content = content;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
