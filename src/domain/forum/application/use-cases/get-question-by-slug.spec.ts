import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Slug } from "../../enterprise/entities/value-object/slug";
import { makeQuestion } from "@/test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug: ", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it("should be able to find a question by slug: ", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("teste-de-question"),
    });

    inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "teste-de-question",
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    });
  });
});
