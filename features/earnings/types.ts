
export type TransactionType = 'SALE' | 'PLATFORM_FEE' | 'REFUND' | 'PAYOUT';

export type FeeType =
    | 'SALE'
    | 'GST'
    | 'PRODUCT_LISTING'
    | 'TRANSACTION_FEE'
    | 'REFUND'
    | 'PAYOUT';

export interface TransactionSummary {
    _sum: {
        amount: string;
    };
    type: TransactionType;
    feeType: FeeType;
}

export interface EarningsResponse {
    transactions: TransactionSummary[][]; // The API returns an array of arrays of transactions
    summary: {
        balance: number;
    };
}
