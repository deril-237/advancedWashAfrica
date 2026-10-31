import { resendMock } from "@/test/mocks/resend";
import { vi } from "vitest";

vi.mock("server-only", () => ({}));

// mock mail service
vi.mock("@/lib/emails/resend", () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}));
