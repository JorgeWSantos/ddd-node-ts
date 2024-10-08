import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";

interface DeleteAnswersUseCaseRequest {
  answersId: string;
  authorId: string;
}

interface DeleteAnswersUseCaseResponse {}

export class DeleteAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    answersId,
    authorId,
  }: DeleteAnswersUseCaseRequest): Promise<DeleteAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findById(answersId);

    if (!answers) {
      throw new Error("Answers not found");
    }

    if (authorId !== answers.authorId.toString()) {
      throw new Error("Not allowed.");
    }

    await this.answerRepository.delete(answers);

    return {};
  }
}
