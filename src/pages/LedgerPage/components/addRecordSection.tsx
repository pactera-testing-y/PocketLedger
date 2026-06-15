import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LedgerRecord, LedgerType } from "../types";
import { useState } from "react";
import { FieldError } from "./feedback";
import { validateLedgerForm, type LedgerFormErrors, type LedgerFormField } from "../ledgerFormValidation";


interface AddRecordSectionProps {
    onAddRecord: (record: LedgerRecord) => void;
}


export function AddRecordSection({onAddRecord}: AddRecordSectionProps){
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<LedgerType>("income");
    const [fieldErrors, setFieldErrors] = useState<LedgerFormErrors>({});

    const clearFieldErrors = (field: LedgerFormField) => {
        setFieldErrors((current) => {
            if(!current[field]) {
                return current;
            }
            const next = { ...current };
            delete next[field];
            return next;
        });
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // if(!title.trim() || !amount.trim() || !type) {
        //     alert("请输入完整的记账信息！");
        //     return;
        const result = validateLedgerForm({ title, amount, type });
        if(result.ok === false) {
            setFieldErrors(result.errors);
            return;
        }

        setFieldErrors({});

        const values = result.values;

        onAddRecord({
            id: crypto.randomUUID(),
            title: values.title,
            amount: values.amount,
            type: values.type,
            date: new Date().toISOString(),
        });
        setTitle("");
        setAmount("");
        setType("income");
    }

    return(
        <section>
            <h2>新增记账</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <Input type="text" 
                        value={title} 
                        onChange={(e) => {setTitle(e.target.value);
                            clearFieldErrors("title");
                        }}
                        placeholder="请输入记账名称" 
                        className="w-1/4"
                        aria-invalid={!!fieldErrors.title}
                    />
                    <FieldError message={fieldErrors.title} /> 
                </div>      
                <div>
                    <Input type="number" 
                        value={amount} 
                        onChange={(e) => {
                            setAmount(e.target.value);
                            clearFieldErrors("amount");
                        }} 
                        placeholder="请输入记账金额" 
                        className="w-1/4"
                        aria-invalid={!!fieldErrors.amount}
                    />
                    <FieldError message={fieldErrors.amount} /> 
                </div>
                <div>
                    <select name="type" id="type"
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value as LedgerType);
                            clearFieldErrors("type");
                        }}
                        aria-invalid={!!fieldErrors.type}
                    >
                        <option value="income">收入</option>
                        <option value="expense">支出</option>
                    </select>
                    <FieldError message={fieldErrors.type} /> 
                </div>

                <Button type="submit">添加记录</Button>
            </form>
        </section>
    )

}