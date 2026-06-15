/** 表单字段下方的校验错误 */
export function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }
    return (
        <p className="mt-1 text-sm text-destructive" role="alert">
            {message}
        </p>
    );
}


/** 页面顶部：localStorage 读取损坏或保存失败时的提示 */
export function StorageAlert({ message }: { message: string | null }) {
    if (!message) {
        return null;
    }
    return (
        <p
            className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
        >
            {message}
        </p>
    );
}