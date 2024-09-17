import { randomUUID } from "node:crypto";

interface AnswerProps {
  content: string
  authorId: string
  questionId: string
}

export class Answer {
  public id: string
  public content: string
  public questionId: string
  public authorId: string

  constructor({ authorId, content, questionId }: AnswerProps, id?: string) {
    this.content = content;
    this.authorId = authorId;
    this.questionId = questionId;
    this.id = id ?? randomUUID();
  }
}