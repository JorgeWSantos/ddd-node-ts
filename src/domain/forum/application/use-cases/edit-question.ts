import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "../../enterprise/entities/question";

interface EditQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  content: string;
  title: string;
}

interface EditQuestionUseCaseResponse {
  question: Question;
}

export class EditQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    questionId,
    authorId,
    content,
    title,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    question.title = title;
    question.content = content;

    await this.questionRepository.save(question);

    return {
      question,
    };
  }
}
