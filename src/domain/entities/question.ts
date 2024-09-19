import { Slug } from "./value-object/slug";
import { Entity } from "../../core/entities/entity";

interface QuestionProps {
  title: string
  authorId: string
  slug: Slug
  content: string
}

export class Question extends Entity<QuestionProps> {
}