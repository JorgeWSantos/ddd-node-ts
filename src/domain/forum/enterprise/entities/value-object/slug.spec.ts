import { Slug } from "./slug";

test("it should be able to create a new slug from text", () => {
  const slug = Slug.createContext("Example question title");

  expect(slug.value).toEqual("example-question-title");
});
