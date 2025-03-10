import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = [];

  /**
   *
   */
  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) { }

  async create(answer: Answer) {
    this.items.push(answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === answerId);

    if (!answer) return null;

    return answer;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    );

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());

    this.items.splice(answerIndex, 1);
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    );

    this.items[answerIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
