import { BillingSubscription } from "./Billing";

export interface IBillingRepository {
  saveBilling(billing: BillingSubscription): Promise<BillingSubscription>;
  getByCustomerKey(customerKey: string): Promise<BillingSubscription | null>;
  getByBillingKey(billingKey: string): Promise<BillingSubscription | null>;
  getAllActive(): Promise<BillingSubscription[]>;
  findDueBillings(targetDate?: Date): Promise<BillingSubscription[]>;
  updateNextBillingDate(customerKey: string, nextBillingDate: string, lastChargedAt: string): Promise<BillingSubscription>;
  cancelBilling(customerKey: string): Promise<boolean>;
  clear(): void;
}
