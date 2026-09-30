import { IPaymentHistoryRepository } from "../domain/IPaymentHistoryRepository";
import { PaymentTransaction } from "../domain/PaymentTransaction";

export class GetPaymentTransactionsUseCase {
  constructor(private paymentHistoryRepository: IPaymentHistoryRepository) {}

  async getAll(): Promise<PaymentTransaction[]> {
    return await this.paymentHistoryRepository.getAll();
  }

  async getLatest(): Promise<PaymentTransaction | null> {
    return await this.paymentHistoryRepository.getLatest();
  }

  async getByOrderId(orderId: string): Promise<PaymentTransaction | null> {
    return await this.paymentHistoryRepository.getByOrderId(orderId);
  }
}
