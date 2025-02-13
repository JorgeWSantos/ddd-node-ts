import { QuestionComment } from "../../enterprise/entities/question-comment";

export interface QuestionCommentsRepository {
  findById(Id: string): Promise<QuestionComment | null>;
  create(questionComment: QuestionComment): Promise<void>;
  delete(questionComment: QuestionComment): Promise<void>;
}
