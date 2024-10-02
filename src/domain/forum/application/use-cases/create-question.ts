import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
}

interface CreateQuestionUseCaseResponse {
  question: Question;
}

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = await Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    await this.questionRepository.create(question);

    return {
      question,
    };
  }
}
