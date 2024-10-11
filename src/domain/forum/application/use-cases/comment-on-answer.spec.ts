import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { makeAnswer } from "@/test/factories/make-answer";
import { InMemoryAnswerCommentsRepository } from "@/test/repositories/in-memory-answer-comments-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment On Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it("should be able to comment on answer: ", async () => {
    const answer = makeAnswer({});

    inMemoryAnswerRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "test",
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual("test");
  });
});
