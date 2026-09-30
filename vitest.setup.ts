import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";
import { SupabaseNoteRepository } from "@/src/infrastructure/repositories/SupabaseNoteRepository";

beforeEach(() => {
  SupabaseNoteRepository.resetSeed();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Polyfill scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
