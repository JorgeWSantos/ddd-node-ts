import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { makeAnswer } from "@/test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "@/test/factories/make-question";
import { NotAllowedError } from "@/core/errors/error/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "@/test/repositories/in-memory-answer-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository,
    );
  });

  it("should be able to choose the best answer: ", async () => {
    const newQuestion = makeQuestion({});

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    const newAnswer2 = makeAnswer({
      questionId: newQuestion.id,
    });

    inMemoryAnswerRepository.items = [newAnswer, newAnswer2];
    inMemoryQuestionRepository.items = [newQuestion];

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        bestAnswerId: newAnswer.id,
      }),
    });
  });

  it("should NOT be able to choose the best answer for another person's question: ", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("author-1"),
    });

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    inMemoryAnswerRepository.create(newAnswer);
    inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "author-non-authorized",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
