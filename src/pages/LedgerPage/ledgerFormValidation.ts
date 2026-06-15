import type { LedgerType } from "./types";

export type LedgerFormField = "title" | "amount" | "type";

export type LedgerFormErrors = Partial<Record<LedgerFormField, string>>;

export type LedgerFormInput = {
    title: string;
    amount: string;
    type: LedgerType;
}

export type LedgerFormValues = {
    title: string;
    amount: string;
    type: LedgerType;
}

export type ValidateLedgerFormResult = 
    | { ok: true; values: LedgerFormValues } 
    | { ok: false; errors: LedgerFormErrors };

/** 新增 / 编辑表单共用校验 */
export function validateLedgerForm(input: LedgerFormInput): ValidateLedgerFormResult {
    const errors: LedgerFormErrors = {};
    const title = input.title.trim();
    const amount = input.amount.trim();

    if (!title) {
        errors.title = "请输入记账名称";
    }
    if (!amount) {
        errors.amount = "请输入金额";
    } else {
        const num = Number(amount);
        if (Number.isNaN(num) || num <= 0) {
            errors.amount = "金额须为大于 0 的数字";
        }
    }
    if (input.type !== "income" && input.type !== "expense") {
        errors.type = "请选择类型";
    }

    if (Object.keys(errors).length > 0) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        values: { title, amount, type: input.type as LedgerType },
    };
}