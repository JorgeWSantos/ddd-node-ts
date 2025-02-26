import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { makeQuestion } from "@/test/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "@/test/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment On Question: ", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it("should be able to comment on question: ", async () => {
    const question = makeQuestion({});

    inMemoryQuestionRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "test",
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual("test");
  });
});
