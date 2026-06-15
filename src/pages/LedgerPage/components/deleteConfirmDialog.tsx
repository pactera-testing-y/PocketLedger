import { Button } from "@base-ui/react/button";
import type { LedgerRecord } from "../types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
    record: LedgerRecord | null;
    onDelete: () => void;
    onCancel: () => void;
}


export function DeleteConfirmDialog(props: DeleteConfirmDialogProps) {
    const { record, onDelete, onCancel } = props;
    if (!record) {
        return null;
    }    

    return (
        <div>
            <AlertDialog
                open={record !== null}
                onOpenChange={(open) => {
                    if (!open) onCancel()
                }}
            >
                <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>删除确认</AlertDialogTitle>
                        <AlertDialogDescription>
                            确定要删除【{record.title}】这条记录吗？
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">取消</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={onDelete}>
                            删除
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}