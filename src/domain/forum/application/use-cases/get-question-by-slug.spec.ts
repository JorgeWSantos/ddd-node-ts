import { CreateQuestionUseCase } from "./create-question";
import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Question } from "../../enterprise/entities/question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Slug } from "../../enterprise/entities/value-object/slug";
import { makeQuestion } from "@/test/factories/make-question";

let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug: ", () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it("should be able to find a question by slug: ", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("teste-de-question"),
    });

    console.log("newQuestion", newQuestion);

    inMemoryQuestionRepository.create(newQuestion);

    const { question } = await sut.execute({
      slug: "teste-de-question",
    });

    expect(newQuestion.id.toValue()).toEqual(question.id.toValue());
  });
});
