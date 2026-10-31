import { beforeEach, describe, expect, it, vi } from "vitest";

const programsServiceMock = vi.hoisted(() => ({
  createProgram: vi.fn(),
  updateProgram: vi.fn(),
  getListProgram: vi.fn(),
  deleteProgram: vi.fn(),
}));

const revalidatePathMock = vi.hoisted(() => vi.fn());

vi.mock("./services", () => programsServiceMock);
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("@/lib/safeAction", () => {
  const createClient = () => {
    const client: Record<string, unknown> = {};
    client.inputSchema = () => client;
    client.bindArgsSchemas = () => client;
    client.action =
      (handler: (context: Record<string, unknown>) => unknown) =>
      (...args: unknown[]) => {
        if (args.length === 0) {
          return handler({});
        }

        if (args.length === 1) {
          return handler({ parsedInput: args[0] });
        }

        return handler({
          bindArgsParsedInputs: [args[0]],
          parsedInput: args[1],
        });
      };
    return client;
  };

  return { authActionClient: createClient() };
});

import {
  createProgramAction,
  deleteProgramAction,
  getProgramListAction,
  updateProgramAction,
} from "./actions";

describe("programs actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates program creation and revalidates the admin list", async () => {
    const program = { id: "program-1", duration: 12 };
    programsServiceMock.createProgram.mockResolvedValue(program);

    await expect(createProgramAction({ duration: 12 })).resolves.toEqual(
      program,
    );

    expect(programsServiceMock.createProgram).toHaveBeenCalledWith({
      duration: 12,
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/programs", "page");
  });

  it("passes the bound identifier to updateProgram and returns its result", async () => {
    const program = { id: "program-1", duration: 24 };
    programsServiceMock.updateProgram.mockResolvedValue(program);

    await expect(
      updateProgramAction("program-1", { duration: 24 }),
    ).resolves.toEqual(program);

    expect(programsServiceMock.updateProgram).toHaveBeenCalledWith(
      "program-1",
      { duration: 24 },
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/programs", "page");
  });

  it("returns the list from the service", async () => {
    const programs = [{ id: "program-1", duration: 12 }];
    programsServiceMock.getListProgram.mockResolvedValue(programs);

    await expect(getProgramListAction()).resolves.toEqual(programs);
    expect(programsServiceMock.getListProgram).toHaveBeenCalledWith();
  });

  it("deletes the requested program and revalidates the admin list", async () => {
    programsServiceMock.deleteProgram.mockResolvedValue(undefined);

    await expect(
      deleteProgramAction({ programId: "program-1" }),
    ).resolves.toBeUndefined();

    expect(programsServiceMock.deleteProgram).toHaveBeenCalledWith("program-1");
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/programs", "page");
  });

  it("does not revalidate when a create fails", async () => {
    const error = new Error("create failed");
    programsServiceMock.createProgram.mockRejectedValue(error);

    await expect(createProgramAction({ duration: 12 })).rejects.toBe(error);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("waits for a successful update before revalidating", async () => {
    let finishUpdate!: (program: { id: string; duration: number }) => void;
    programsServiceMock.updateProgram.mockReturnValue(
      new Promise((resolve) => {
        finishUpdate = resolve;
      }),
    );

    const actionResult = updateProgramAction("program-1", { duration: 24 });
    expect(revalidatePathMock).not.toHaveBeenCalled();

    finishUpdate({ id: "program-1", duration: 24 });
    await expect(actionResult).resolves.toEqual({
      id: "program-1",
      duration: 24,
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/programs", "page");
  });

  it("does not revalidate when an update fails", async () => {
    const error = new Error("update failed");
    programsServiceMock.updateProgram.mockRejectedValue(error);

    await expect(
      updateProgramAction("program-1", { duration: 24 }),
    ).rejects.toBe(error);
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });
});
