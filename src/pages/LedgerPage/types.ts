// 记账记录
export interface LedgerRecord {
    id: string;
    title: string;
    amount: string;
    type: string;
    date: string;
}

// 按日期分组的记账记录
export interface GroupedRecords {
    today: LedgerRecord[];
    thisMonth: LedgerRecord[];
    earlier: LedgerRecord[];
  }

// 记账类型
export type LedgerType = "income" | "expense";


// 收支统计汇总
export type LedgerSummary = {
    incomeTotal: number;
    expenseTotal: number;
    balance: number;
    incomeCount: number;
    expenseCount: number;
    totalCount: number;
};