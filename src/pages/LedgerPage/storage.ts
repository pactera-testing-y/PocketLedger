import type { LedgerRecord } from "./types";

const STORAGE_KEY = "records";

export type LoadRecordsResult = {
    records: LedgerRecord[];
    corrupted: boolean;
};

export type SaveRecordsResult =
    | { ok: true }
    | { ok: false; message: string };

function isLedgerRecord(value: unknown): value is LedgerRecord {
    if (!value || typeof value !== "object") {
        return false;
    }
    const record = value as Record<string, unknown>;
    return (
        typeof record.id === "string" &&
        typeof record.title === "string" &&
        typeof record.amount === "string" &&
        (record.type === "income" || record.type === "expense") &&
        typeof record.date === "string"
    );
}

/** 从 localStorage 安全读取；解析失败或结构不对时返回空数组 */
export function loadRecords(): LoadRecordsResult {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { records: [], corrupted: false };
        }

        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return { records: [], corrupted: true };
        }

        const records = parsed.filter(isLedgerRecord);
        if (records.length !== parsed.length) {
            return { records, corrupted: true };
        }

        return { records, corrupted: false };
    } catch {
        return { records: [], corrupted: true };
    }
}

/** 写入 localStorage；配额满或其它异常时返回错误信息 */
export function saveRecords(records: LedgerRecord[]): SaveRecordsResult {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        return { ok: true };
    } catch (error) {
        const isQuota =
            error instanceof DOMException && error.name === "QuotaExceededError";
        return {
            ok: false,
            message: isQuota
                ? "本地存储空间已满，请清理浏览器数据后重试"
                : "保存到本地失败，刷新后可能丢失最新修改",
        };
    }
}
