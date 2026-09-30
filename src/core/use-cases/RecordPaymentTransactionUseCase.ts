import { IPaymentHistoryRepository } from "../domain/IPaymentHistoryRepository";
import { PaymentTransaction, StartPaymentInput } from "../domain/PaymentTransaction";

export class RecordPaymentTransactionUseCase {
  constructor(private paymentHistoryRepository: IPaymentHistoryRepository) {}

  /**
   * 결제 시작 시 PENDING 상태로 트랜잭션 기록
   */
  async startPayment(input: StartPaymentInput): Promise<PaymentTransaction> {
    return await this.paymentHistoryRepository.createTransaction(input);
  }

  /**
   * 사용자가 결제 모듈을 닫거나 직접 취소한 경우 CANCELLED 상태로 기록
   */
  async cancelPayment(
    orderId: string,
    reason: string = "사용자가 결제를 취소했습니다."
  ): Promise<PaymentTransaction> {
    return await this.paymentHistoryRepository.updateTransactionStatus(
      orderId,
      "CANCELLED",
      { failureReason: reason }
    );
  }

  /**
   * 결제 승인 요청 실패 시 FAILED 상태 및 에러 원인 기록
   */
  async failPayment(
    orderId: string,
    errorCode: string,
    failureReason: string
  ): Promise<PaymentTransaction> {
    return await this.paymentHistoryRepository.updateTransactionStatus(
      orderId,
      "FAILED",
      { errorCode, failureReason }
    );
  }

  /**
   * 결제 성공 시 SUCCESS 상태 및 결제 키 기록
   */
  async completePayment(
    orderId: string,
    paymentKey?: string
  ): Promise<PaymentTransaction> {
    return await this.paymentHistoryRepository.updateTransactionStatus(
      orderId,
      "SUCCESS",
      { paymentKey }
    );
  }
}
