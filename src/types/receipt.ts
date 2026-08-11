export interface Receipt {
  id: string;
  transactionId: string;
  imageUrl: string;
  fileName?: string;
  note?: string;
  createdAt: string;
}
