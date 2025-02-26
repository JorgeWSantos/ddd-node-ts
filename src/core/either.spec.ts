import { Either, left, right } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right("success");
  }

  return left("error");
}

test("success", () => {
  const sucessResult = doSomething(true);

  if (sucessResult.isRight()) {
    console.log(sucessResult.value);
  }

  expect(sucessResult.isRight()).toBe(true);
  expect(sucessResult.isLeft()).toBe(false);
});

test("error", () => {
  const errorResult = doSomething(false);

  expect(errorResult.isLeft()).toBe(true);
  expect(errorResult.isRight()).toBe(false);
});
