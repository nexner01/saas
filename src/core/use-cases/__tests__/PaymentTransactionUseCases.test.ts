import { describe, it, expect, beforeEach } from "vitest";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { RecordPaymentTransactionUseCase } from "@/src/core/use-cases/RecordPaymentTransactionUseCase";
import { GetPaymentTransactionsUseCase } from "@/src/core/use-cases/GetPaymentTransactionsUseCase";

describe("Payment Transaction History & Status System (TDD)", () => {
  let repository: PaymentHistoryRepository;
  let recordUseCase: RecordPaymentTransactionUseCase;
  let getUseCase: GetPaymentTransactionsUseCase;

  beforeEach(() => {
    repository = new PaymentHistoryRepository();
    repository.clear();
    recordUseCase = new RecordPaymentTransactionUseCase(repository);
    getUseCase = new GetPaymentTransactionsUseCase(repository);
  });

  it("records PENDING state when payment initiates", async () => {
    const tx = await recordUseCase.startPayment({
      orderId: "ORDER-TEST-001",
      orderName: "Noteflow Pro (월간)",
      amount: 19000,
      plan: "PRO",
    });

    expect(tx.status).toBe("PENDING");
    expect(tx.orderId).toBe("ORDER-TEST-001");
    expect(tx.amount).toBe(19000);

    const latest = await getUseCase.getLatest();
    expect(latest?.status).toBe("PENDING");
  });

  it("records CANCELLED state when user intentionally cancels or closes payment modal", async () => {
    await recordUseCase.startPayment({
      orderId: "ORDER-TEST-002",
      orderName: "Noteflow Pro (월간)",
      amount: 19000,
      plan: "PRO",
    });

    const cancelledTx = await recordUseCase.cancelPayment(
      "ORDER-TEST-002",
      "사용자가 결제창을 닫거나 취소했습니다."
    );

    expect(cancelledTx.status).toBe("CANCELLED");
    expect(cancelledTx.failureReason).toBe("사용자가 결제창을 닫거나 취소했습니다.");

    const tx = await getUseCase.getByOrderId("ORDER-TEST-002");
    expect(tx?.status).toBe("CANCELLED");
  });

  it("records FAILED state when payment attempt fails (e.g. card error, limit exceeded)", async () => {
    await recordUseCase.startPayment({
      orderId: "ORDER-TEST-003",
      orderName: "Noteflow Pro (월간)",
      amount: 19000,
      plan: "PRO",
    });

    const failedTx = await recordUseCase.failPayment(
      "ORDER-TEST-003",
      "REJECT_CARD_COMPANY",
      "카드사 한도 초과로 결제가 승인되지 않았습니다."
    );

    expect(failedTx.status).toBe("FAILED");
    expect(failedTx.errorCode).toBe("REJECT_CARD_COMPANY");
    expect(failedTx.failureReason).toBe("카드사 한도 초과로 결제가 승인되지 않았습니다.");

    const tx = await getUseCase.getByOrderId("ORDER-TEST-003");
    expect(tx?.status).toBe("FAILED");
  });

  it("records SUCCESS state when payment succeeds and activates membership", async () => {
    await recordUseCase.startPayment({
      orderId: "ORDER-TEST-004",
      orderName: "Noteflow Pro (월간)",
      amount: 19000,
      plan: "PRO",
    });

    const successTx = await recordUseCase.completePayment(
      "ORDER-TEST-004",
      "PAY_KEY_MOCK_12345"
    );

    expect(successTx.status).toBe("SUCCESS");
    expect(successTx.paymentKey).toBe("PAY_KEY_MOCK_12345");

    const tx = await getUseCase.getByOrderId("ORDER-TEST-004");
    expect(tx?.status).toBe("SUCCESS");
  });

  it("retrieves full transaction history in chronological order", async () => {
    await recordUseCase.startPayment({
      orderId: "ORDER-1",
      orderName: "Plan 1",
      amount: 19000,
      plan: "PRO",
    });
    await recordUseCase.cancelPayment("ORDER-1");

    await recordUseCase.startPayment({
      orderId: "ORDER-2",
      orderName: "Plan 2",
      amount: 19000,
      plan: "PRO",
    });
    await recordUseCase.completePayment("ORDER-2", "KEY-2");

    const all = await getUseCase.getAll();
    expect(all).toHaveLength(2);
    expect(all[0].orderId).toBe("ORDER-2"); // 최신순
    expect(all[1].orderId).toBe("ORDER-1");
  });
});
