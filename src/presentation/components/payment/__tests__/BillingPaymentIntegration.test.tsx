import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TossBillingModal } from "../TossBillingModal";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";

describe("Toss Payments Billing Modal & Recurring Flow (TDD)", () => {
  let billingRepository: BillingRepository;
  let subscriptionRepository: SubscriptionRepository;

  beforeEach(() => {
    billingRepository = new BillingRepository();
    billingRepository.clear();

    subscriptionRepository = new SubscriptionRepository();
    subscriptionRepository.reset();
  });

  it("renders billing modal with 30-day recurring interval notice", async () => {
    const handleClose = vi.fn();

    render(
      <TossBillingModal
        isOpen={true}
        onClose={handleClose}
        customerKey="CUST_TEST_001"
        planName="Pro"
        amount={19000}
      />
    );

    // 30일 주기 안내 문구 렌더링 확인
    expect(
      await screen.findByText(/30일마다 자동으로 갱신되는 정기 결제/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/토스페이먼츠 정기 결제 카드 등록/i)).toBeInTheDocument();
  });

  it("registers billing key and triggers initial charge when user submits registration", async () => {
    const handleSuccess = vi.fn();

    render(
      <TossBillingModal
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={handleSuccess}
        customerKey="CUST_TEST_002"
        planName="Pro"
        amount={19000}
      />
    );

    // "정기 결제 카드 등록 및 시작" 버튼 클릭
    const registerBtn = screen.getByRole("button", {
      name: /정기 결제 카드 등록 및 시작/i,
    });
    fireEvent.click(registerBtn);

    // 빌링키가 저장되고 다음 결제일(30일 후)이 세팅되었는지 확인
    await waitFor(async () => {
      const savedBilling = await billingRepository.getByCustomerKey("CUST_TEST_002");
      expect(savedBilling).not.toBeNull();
      expect(savedBilling?.intervalDays).toBe(30);
      expect(savedBilling?.status).toBe("ACTIVE");
    });

    // 멤버십이 활성화되었는지 확인
    await waitFor(async () => {
      const sub = await subscriptionRepository.getSubscription();
      expect(sub.isSubscribed).toBe(true);
      expect(sub.plan).toBe("PRO");
    });
  });
});
