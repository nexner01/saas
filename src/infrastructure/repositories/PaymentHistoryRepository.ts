import {
  PaymentTransaction,
  StartPaymentInput,
  PaymentStatus,
} from "@/src/core/domain/PaymentTransaction";
import { IPaymentHistoryRepository } from "@/src/core/domain/IPaymentHistoryRepository";

const STORAGE_KEY = "noteflow_payment_transactions";

let memoryTransactions: PaymentTransaction[] = [];

export class PaymentHistoryRepository implements IPaymentHistoryRepository {
  private loadFromStorage(): PaymentTransaction[] {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          // parse error fallback
        }
      }
    }
    return memoryTransactions;
  }

  private saveToStorage(transactions: PaymentTransaction[]): void {
    memoryTransactions = transactions;
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }

  async createTransaction(input: StartPaymentInput): Promise<PaymentTransaction> {
    const list = this.loadFromStorage();
    const now = new Date().toISOString();

    const newTx: PaymentTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId: input.orderId,
      orderName: input.orderName,
      amount: input.amount,
      plan: input.plan,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newTx, ...list];
    this.saveToStorage(updated);
    return newTx;
  }

  async updateTransactionStatus(
    orderId: string,
    status: PaymentStatus,
    extra?: {
      paymentKey?: string;
      errorCode?: string;
      failureReason?: string;
    }
  ): Promise<PaymentTransaction> {
    const list = this.loadFromStorage();
    const now = new Date().toISOString();

    const index = list.findIndex((tx) => tx.orderId === orderId);

    if (index === -1) {
      // 만약 등록되지 않은 주문이면 신규로 생성 후 상태 부여
      const newTx: PaymentTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        orderId,
        orderName: "Noteflow 요금제",
        amount: 0,
        plan: "PRO",
        status,
        paymentKey: extra?.paymentKey,
        errorCode: extra?.errorCode,
        failureReason: extra?.failureReason,
        createdAt: now,
        updatedAt: now,
      };
      this.saveToStorage([newTx, ...list]);
      return newTx;
    }

    const target = list[index];
    const updatedTx: PaymentTransaction = {
      ...target,
      status,
      paymentKey: extra?.paymentKey ?? target.paymentKey,
      errorCode: extra?.errorCode ?? target.errorCode,
      failureReason: extra?.failureReason ?? target.failureReason,
      updatedAt: now,
    };

    list[index] = updatedTx;
    this.saveToStorage([...list]);
    return updatedTx;
  }

  async getAll(): Promise<PaymentTransaction[]> {
    const list = this.loadFromStorage();
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getByOrderId(orderId: string): Promise<PaymentTransaction | null> {
    const list = this.loadFromStorage();
    const found = list.find((tx) => tx.orderId === orderId);
    return found || null;
  }

  async getLatest(): Promise<PaymentTransaction | null> {
    const all = await this.getAll();
    return all.length > 0 ? all[0] : null;
  }

  clear(): void {
    memoryTransactions = [];
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}
