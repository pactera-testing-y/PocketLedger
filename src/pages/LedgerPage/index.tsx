import { useEffect, useMemo, useRef, useState } from "react";
import { AddRecordSection } from "./components/addRecordSection";
import { LedgerListSection } from "./components/ledgerListSection";
import type { LedgerRecord } from "./types";
import { groupRecordsByDate } from "./utils";
import { FilterSection } from "./components/filterSection";
import { loadRecords, saveRecords } from "./storage";
import { StorageAlert } from "./components/feedback";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const CORRUPTED_MESSAGE = "本地数据已损坏或格式不正确，已恢复为空列表";

export function LedgerPage(){
    const [filterType, setFilterType] = useState("all");
    const [initialLoad] = useState(() => loadRecords());
    
    const [records, setRecords] = useState<LedgerRecord[]>(initialLoad.records);

    const [storageMessage, setStorageMessage] = useState<string | null>(() =>
        initialLoad.corrupted ? CORRUPTED_MESSAGE : null,
    );


    const initialRecordCount = useRef(initialLoad.records.length);

    useEffect(() => {
        const result = saveRecords(records);
        if (result.ok === false) {
            setStorageMessage(result.message);
            return;
        }
        //更新提示信息
        setStorageMessage((current) => {
            if(current === CORRUPTED_MESSAGE) {
                return records.length > initialRecordCount.current ? null : current;
            }
            return null;
        });
    }, [records]);


    //添加记录
    const handleAddRecord = (newRecord: LedgerRecord) => {
        setRecords((current) => [...current, newRecord]);
    }
        
    const filteredRecords = useMemo(() => {
        if (filterType === "all") {
            return records;
        }
        return records.filter((record) => record.type === filterType);
    }, [filterType, records]);
    
    
    const groupedRecords = useMemo(() => 
        groupRecordsByDate(filteredRecords), [filteredRecords]);

    //更新记录
    const handleUpdateRecord = (id: string, updates: Pick<LedgerRecord, "title" | "amount" | "type">) => {
        setRecords((current) => 
            current.map((record) => 
                record.id === id ? {...record, ...updates} : record
            ),
        );
    }

    //删除记录
    const handleDeleteRecord = (id: string) => {
        setRecords((current) => current.filter((record) => record.id !== id));
    }

    return(
        <div>
            <h1>记账本</h1>
            <Link to="/statistics">
                <Button type="button">统计</Button>
            </Link>
            <StorageAlert message={storageMessage} />
            <AddRecordSection 
                onAddRecord={handleAddRecord}
            />

            <FilterSection onFilterTypeChange={setFilterType} />

            <LedgerListSection 
                filteredRecords={filteredRecords}
                groupedRecords={groupedRecords}
                onUpdateRecord={handleUpdateRecord}
                onDeleteRecord={handleDeleteRecord}
                
            />
            
        </div>
    )
}