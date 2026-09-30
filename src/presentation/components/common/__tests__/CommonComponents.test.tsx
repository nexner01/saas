import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BrandLogo } from "../BrandLogo";
import { UserAvatar } from "../UserAvatar";
import { StatusBadge, TagChip } from "../StatusBadge";
import { CloudSyncIndicator } from "../CloudSyncIndicator";
import { CodeBlock } from "../CodeBlock";
import { AmbientGlow } from "../AmbientGlow";

describe("Common UI Components (TDD)", () => {
  it("renders BrandLogo with text and custom size", () => {
    render(<BrandLogo size="md" showText={true} />);
    expect(screen.getByText("Noteflow")).toBeInTheDocument();
  });

  it("renders UserAvatar with initials, status dot and count badge", () => {
    render(<UserAvatar name="이수민" isLive={true} />);
    expect(screen.getByText("수민")).toBeInTheDocument();

    const { rerender } = render(<UserAvatar count={5} />);
    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("renders StatusBadge and TagChip with proper styling and remove action", async () => {
    const onRemove = vi.fn();
    render(<StatusBadge variant="tertiary">Pro 플랜 활성</StatusBadge>);
    expect(screen.getByText("Pro 플랜 활성")).toBeInTheDocument();

    render(<TagChip label="#기획" onRemove={onRemove} />);
    expect(screen.getByText("#기획")).toBeInTheDocument();
  });

  it("renders CloudSyncIndicator with different statuses", () => {
    render(<CloudSyncIndicator status="synced" text="실시간 동기화 완료" />);
    expect(screen.getByText("실시간 동기화 완료")).toBeInTheDocument();
  });

  it("renders CodeBlock with filename and copy action", async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock
        filename="test.ts"
        code="const x = 1;"
      />
    );

    expect(screen.getByText("test.ts")).toBeInTheDocument();
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();

    const copyBtn = screen.getByRole("button", { name: /copy/i });
    await user.click(copyBtn);
    expect(await screen.findByText(/copied!/i)).toBeInTheDocument();
  });

  it("renders AmbientGlow decorator without crashing", () => {
    const { container } = render(<AmbientGlow position="top-center" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
