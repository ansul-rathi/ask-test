export type SubscriptionStatus = 'active' | 'inactive';

export interface UserAttributes {
  'custom:credits': number;
  'custom:subStatus': SubscriptionStatus;
}