import { BillingSubscription } from "@/src/core/domain/Billing";
import { IBillingRepository } from "@/src/core/domain/IBillingRepository";

const STORAGE_KEY = "noteflow_billing_subscriptions";

let memoryBillings: BillingSubscription[] = [];

export class BillingRepository implements IBillingRepository {
  private loadFromStorage(): BillingSubscription[] {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          // fallback
        }
      }
    }
    return memoryBillings;
  }

  private saveToStorage(list: BillingSubscription[]): void {
    memoryBillings = list;
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }

  async saveBilling(billing: BillingSubscription): Promise<BillingSubscription> {
    const list = this.loadFromStorage();
    const existingIndex = list.findIndex(
      (b) => b.customerKey === billing.customerKey
    );

    if (existingIndex >= 0) {
      list[existingIndex] = billing;
    } else {
      list.push(billing);
    }

    this.saveToStorage([...list]);
    return billing;
  }

  async getByCustomerKey(customerKey: string): Promise<BillingSubscription | null> {
    const list = this.loadFromStorage();
    const found = list.find((b) => b.customerKey === customerKey);
    return found || null;
  }

  async getByBillingKey(billingKey: string): Promise<BillingSubscription | null> {
    const list = this.loadFromStorage();
    const found = list.find((b) => b.billingKey === billingKey);
    return found || null;
  }

  async getAllActive(): Promise<BillingSubscription[]> {
    const list = this.loadFromStorage();
    return list.filter((b) => b.status === "ACTIVE");
  }

  async findDueBillings(targetDate: Date = new Date()): Promise<BillingSubscription[]> {
    const list = this.loadFromStorage();
    // 시간과 관계없이 기준 일자의 당일 종료(23:59:59.999) 시점을 기준으로 필터링
    const targetISO = targetDate.toISOString().substring(0, 10);
    const endOfDayTimestamp = new Date(`${targetISO}T23:59:59.999Z`).getTime();

    return list.filter((b) => {
      if (b.status !== "ACTIVE") return false;
      const billingTimestamp = new Date(b.nextBillingDate).getTime();
      return billingTimestamp <= endOfDayTimestamp;
    });
  }

  async updateNextBillingDate(
    customerKey: string,
    nextBillingDate: string,
    lastChargedAt: string
  ): Promise<BillingSubscription> {
    const list = this.loadFromStorage();
    const index = list.findIndex((b) => b.customerKey === customerKey);

    if (index === -1) {
      throw new Error("해당 고객의 빌링 정보를 찾을 수 없습니다.");
    }

    const updated: BillingSubscription = {
      ...list[index],
      nextBillingDate,
      lastChargedAt,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.saveToStorage([...list]);
    return updated;
  }

  async cancelBilling(customerKey: string): Promise<boolean> {
    const list = this.loadFromStorage();
    const index = list.findIndex((b) => b.customerKey === customerKey);
    if (index === -1) return false;

    list[index] = {
      ...list[index],
      status: "CANCELLED",
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage([...list]);
    return true;
  }

  clear(): void {
    memoryBillings = [];
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}
