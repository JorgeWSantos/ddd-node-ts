import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Slug } from "./value-object/slug";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import dayjs from "dayjs";
import { QuestionAttachmentList } from "./question-attachment-list";
import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId;
  attachments: QuestionAttachmentList;
  title: string;
  slug: Slug;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get slug() {
    return this.props.slug;
  }

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt) <= 3;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createContext(title);
    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId === undefined) return;

    if (
      this.props.bestAnswerId === undefined ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    )
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );

    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  static create(
    props: Optional<QuestionProps, "createdAt" | "slug" | "attachments">,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createContext(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }
}
