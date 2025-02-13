import { questionCommentsRepository } from "@/domain/forum/application/repositories/question-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

interface DeleteQuestionCommentUseCaseResponse {}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      throw new Error("Question Comment not found.");
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error("Not Allowed.");
    }

    await this.questionCommentsRepository.delete(questionComment);

    return {};
  }
}
