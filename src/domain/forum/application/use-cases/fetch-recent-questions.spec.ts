import { InMemoryQuestionRepository } from "@/test/repositories/in-memory-question-repository";
import { makeQuestion } from "@/test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionAttachmentsRepository } from "@/test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions: ", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository);
  });

  it("should be able to fetch recent questions: ", async () => {
    inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 20) }),
    );
    inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 18) }),
    );
    inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2022, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2022, 0, 23),
      }),
      expect.objectContaining({
        createdAt: new Date(2022, 0, 20),
      }),
      expect.objectContaining({
        createdAt: new Date(2022, 0, 18),
      }),
    ]);
  });

  it("should be able to fetch paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
