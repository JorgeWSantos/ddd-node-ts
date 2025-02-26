import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { Either, right } from "@/core/either";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";

interface AnswerQuestionsUseCaseRequest {
  instructorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
}

type AnswerQuestionsUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionsUseCase {
  constructor(private answersRepository: AnswerRepository) { }

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionsUseCaseRequest): Promise<AnswerQuestionsUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
