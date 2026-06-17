import type { GroupedRecords, LedgerRecord, LedgerSummary } from "./types";

// 按日期分组记账记录
export const groupRecordsByDate = (records: LedgerRecord[]) : GroupedRecords => {
    const now = new Date();
    const sorted = [...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    //遍历排序后的记录并累计到分组对象中
    return sorted.reduce(
        (group, record) => {
            const date = new Date(record.date);
            if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
                group.today.push(record);
            } else if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
                group.thisMonth.push(record);
            } else {
                group.earlier.push(record);
            }
            return group;
        },
        {
            today: [],
            thisMonth: [],
            earlier: [],
        } as GroupedRecords
    )
}


const LEDGER_TYPES_LABELS:Record<string, string> = {
    income: "收入",
    expense: "支出",
}

// 获取记账类型标签
export const getLedgerTypeLabel = (type: string) => {
    return LEDGER_TYPES_LABELS[type] ?? type;
}


// 计算收支统计汇总
export function calculateLedgerSummary(records: LedgerRecord[]): LedgerSummary {
    
    let incomeTotal = 0;
    let expenseTotal = 0;
    let incomeCount = 0;
    let expenseCount = 0;


    for (const record of records) {
        if (record.type === "income") {
            incomeTotal += Number(record.amount);
            incomeCount++;
        } else {
            expenseTotal += Number(record.amount);
            expenseCount++;
        }
    }

    return {
        incomeTotal,
        expenseTotal,
        balance: incomeTotal - expenseTotal,
        incomeCount,
        expenseCount,
        totalCount: records.length,
    };
}