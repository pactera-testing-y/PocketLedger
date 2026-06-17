import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { loadRecords } from "../storage";
import { useMemo, useState } from "react";
import { calculateLedgerSummary } from "../utils";

export function StatisticPage(){
    const [records] = useState(() => loadRecords().records);
    const summary = useMemo(() => calculateLedgerSummary(records), [records]);

    return(
        <div>
            <div>
                <h1>收支统计</h1>
                <Link to="/">
                    <Button type="button">
                        返回首页
                    </Button>
                </Link>
            </div>

            {records.length === 0 ? (
                <p>暂无记账记录</p>
            ) : (
                <div>
                    <p>总收入：{summary.incomeTotal}</p>
                    <p>总支出：{summary.expenseTotal}</p>
                    <p>余额：{summary.balance}</p>
                    <p>收入次数：{summary.incomeCount}</p>
                    <p>支出次数：{summary.expenseCount}</p>
                    <p>总次数：{summary.totalCount}</p>
                </div>
            )}
            
        </div>
    )
}