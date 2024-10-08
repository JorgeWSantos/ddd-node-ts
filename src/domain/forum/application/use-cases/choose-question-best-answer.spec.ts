import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { InMemoryAnswerRepository } from "@/test/repositories/in-memory-answer-repository";
import { makeAnswer } from "@/test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "@/test/factories/make-question";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer: ", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
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

    const { question } = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    });

    expect(question).toMatchObject({
      bestAnswerId: newAnswer.id,
    });
  });

  it("should NOT be able to choose the best answer for another person's question: ", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("author-1"),
    });

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    const newAnswer2 = makeAnswer({
      questionId: newQuestion.id,
    });

    inMemoryAnswerRepository.items = [newAnswer, newAnswer2];
    inMemoryQuestionRepository.items = [newQuestion];

    expect(() => {
      return sut.execute({
        answerId: newAnswer.id.toString(),
        authorId: "author-non-authorized",
      });
    }).rejects.toBeInstanceOf(Error);

    // expect(question).toMatchObject({
    //   bestAnswerId: newAnswer.id,
    // });
  });
});
