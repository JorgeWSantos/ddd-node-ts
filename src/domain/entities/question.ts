import { randomUUID } from "node:crypto";
import { Slug } from "./value-object/slug";

interface QuestionProps {
  title: string
  authorId: string
  slug: Slug
  content: string
}

export class Question {
  public id: string
  public title: string
  public content: string
  public slug: Slug
  public authorId: string

  constructor({ authorId, content, title, slug }: QuestionProps, id?: string) {
    this.title = title;
    this.content = content;
    this.slug = slug;
    this.authorId = authorId;
    this.id = id ?? randomUUID();
  }
}