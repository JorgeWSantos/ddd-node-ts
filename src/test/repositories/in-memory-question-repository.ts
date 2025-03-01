import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = [];

  /**
   *
   */
  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) { }

  async create(question: Question) {
    this.items.push(question);
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) return null;

    return question;
  }

  async delete(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
    this.items.splice(index, 1);
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    );

    this.items[questionIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}
