import { vi } from "vitest";

export const resendMock = {
  emails: {
    send: vi.fn(),
  },
};
