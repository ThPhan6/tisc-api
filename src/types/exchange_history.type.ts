export interface ExchangeHistoryEntity {
  id: string;
  relation_id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  created_at: string;
  deleted_at: null | string;
}
