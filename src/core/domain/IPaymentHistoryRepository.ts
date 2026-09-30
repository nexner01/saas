import { PaymentTransaction, StartPaymentInput, PaymentStatus } from "./PaymentTransaction";

export interface IPaymentHistoryRepository {
  createTransaction(input: StartPaymentInput): Promise<PaymentTransaction>;
  updateTransactionStatus(
    orderId: string,
    status: PaymentStatus,
    extra?: {
      paymentKey?: string;
      errorCode?: string;
      failureReason?: string;
    }
  ): Promise<PaymentTransaction>;
  getAll(): Promise<PaymentTransaction[]>;
  getByOrderId(orderId: string): Promise<PaymentTransaction | null>;
  getLatest(): Promise<PaymentTransaction | null>;
  clear(): void;
}
