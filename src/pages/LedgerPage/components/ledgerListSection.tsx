import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState} from "react";
import type { GroupedRecords, LedgerRecord, LedgerType } from "../types";
import { getLedgerTypeLabel } from "../utils";
import { validateLedgerForm, type LedgerFormErrors, type LedgerFormField } from "../ledgerFormValidation";
import { FieldError } from "./feedback";
import { DeleteConfirmDialog } from "./deleteConfirmDialog";


interface LedgerListSectionProps {
    filteredRecords: LedgerRecord[];
    groupedRecords: GroupedRecords;

    onUpdateRecord: (id:string, 
        updates: Pick<LedgerRecord, "title" | "amount" | "type">
    ) => void;

    onDeleteRecord: (id: string) => void;
}

export function LedgerListSection(props: LedgerListSectionProps){
    const { filteredRecords, groupedRecords, onUpdateRecord, onDeleteRecord } = props;

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [editingAmount, setEditingAmount] = useState("");
    const [editingType, setEditingType] = useState<LedgerType>("income");
    const [editFieldErrors, setEditFieldErrors] = useState<LedgerFormErrors>({});
    const [pendingDelete, setPendingDelete] = useState<LedgerRecord | null>(null);

    const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!editingId) {
            return;
        }

        const result = validateLedgerForm({ 
            title: editingTitle, 
            amount: editingAmount, 
            type: editingType,
         });

        if(result.ok === false) {
            setEditFieldErrors(result.errors);
            return;
        }

        const values = result.values;
        onUpdateRecord(editingId, {
            title: values.title,
            amount: values.amount,
            type: values.type,
        });
        
        cancelEdit();
    }

    const cancelEdit = () => { 
        setEditingId(null);
        setEditingTitle("");
        setEditingAmount("");
        setEditingType("income");
    }

    const requestDelete = (record: LedgerRecord) => {
        setPendingDelete(record);
    };

    const cancelDelete = () => {
        setPendingDelete(null);
    }

    const confirmDelete = () => {
        if(!pendingDelete) {
            return;
        }
        if(pendingDelete.id === editingId) {
            cancelEdit();
        }
        onDeleteRecord(pendingDelete.id);
        setPendingDelete(null);
    }

    const clearEditFieldError = (field: LedgerFormField) => {
        setEditFieldErrors((current) => {
            if (!current[field]) {
                return current;
            }
            const next = { ...current };
            delete next[field];
            return next;
        });
    };

    const beginEdit = (record: LedgerRecord) => {
        setEditingId(record.id);
        setEditingTitle(record.title);
        setEditingAmount(record.amount);
        setEditingType(record.type as LedgerType);
    }
    
    const displayGroups = [
        { title: "今日", records: groupedRecords.today },
        { title: "本月", records: groupedRecords.thisMonth },
        { title: "更早", records: groupedRecords.earlier },
    ] as const;

    return(
        <section>
            <DeleteConfirmDialog 
                record={pendingDelete}
                onDelete={confirmDelete} 
                onCancel={cancelDelete} />
            {/* <h2>记账列表</h2> */}
            {filteredRecords.length === 0 ? (
                <p>暂无记账记录</p>
            ) : (
                <div>
                    {
                        displayGroups.map((group) => 
                            group.records.length > 0 ? (
                                <div key={group.title}>
                                    <h3>{group.title}</h3>
                                    <ul>
                                        {group.records.map((record) => (
                                            <li key={record.id}>
                                                {editingId === record.id ? (
                                                    <form onSubmit={handleUpdateSubmit}>
                                                        <div>
                                                            <Input value={editingTitle} 
                                                                onChange={(e) => {
                                                                    setEditingTitle(e.target.value);
                                                                    clearEditFieldError("title");
                                                                }}
                                                                aria-invalid={!!editFieldErrors.title}
                                                            />
                                                            <FieldError message={editFieldErrors.title} /> 
                                                        </div>
                                                        <div>
                                                            <Input value={editingAmount} 
                                                                onChange={(e) => {
                                                                    setEditingAmount(e.target.value);
                                                                    clearEditFieldError("amount");
                                                                } }
                                                                aria-invalid={!!editFieldErrors.amount}
                                                            />
                                                            <FieldError message={editFieldErrors.amount} /> 
                                                        </div>
                                                        <div>
                                                            <select value={editingType} 
                                                                onChange={(e) => {
                                                                    setEditingType(e.target.value as LedgerType);
                                                                    clearEditFieldError("type");
                                                                }}
                                                                aria-invalid={!!editFieldErrors.type}
                                                            >
                                                                <option value="income">收入</option>
                                                                <option value="expense">支出</option>
                                                            </select>
                                                            <FieldError message={editFieldErrors.type} /> 
                                                        </div>
                                                        <div>
                                                            <Button type="submit">保存</Button>
                                                            <Button type="button" onClick={cancelEdit}>取消</Button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                                                        <span>{record.title}</span>
                                                        <span>{record.amount}</span>
                                                        <span>{getLedgerTypeLabel(record.type)}</span>
                                                        <Button type="button" onClick={() => beginEdit(record)}>编辑</Button>
                                                        <Button type="button" onClick={() => requestDelete(record)}>删除</Button>
                                                    </div>
                                                )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null
                    )}
                    </div>
                )}
        </section>
    )
}