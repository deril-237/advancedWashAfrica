import { describe, expect, it } from "vitest";
import { createProgramSchema, updateProgramSchema } from "./schemas";

describe.each([
  ["createProgramSchema", createProgramSchema],
  ["updateProgramSchema", updateProgramSchema],
])("%s", (_name, schema) => {
  it("accepts a positive integer duration", () => {
    expect(schema.parse({ duration: 12 })).toEqual({ duration: 12 });
  });

  it("coerces a numeric string to a number", () => {
    expect(schema.parse({ duration: "12" })).toEqual({ duration: 12 });
  });

  it.each([0, -1, 1.5, "not-a-number", undefined])(
    "rejects an invalid duration: %s",
    (duration) => {
      expect(schema.safeParse({ duration }).success).toBe(false);
    },
  );
});
