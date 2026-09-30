import { IBillingRepository } from "../domain/IBillingRepository";
import { BillingSubscription } from "../domain/Billing";

export class GetBillingInfoUseCase {
  constructor(private billingRepository: IBillingRepository) {}

  async execute(customerKey: string): Promise<BillingSubscription | null> {
    return await this.billingRepository.getByCustomerKey(customerKey);
  }
}
