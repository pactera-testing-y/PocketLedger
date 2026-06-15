import { Button } from "@/components/ui/button";

interface FilterSectionProps {
    onFilterTypeChange: (filterType: string) => void;
}

export function FilterSection({onFilterTypeChange}: FilterSectionProps){
    return(
        <section>
            <span>按类型筛选：</span>
            <Button type="button" onClick={() => onFilterTypeChange("all")}>
                全部
            </Button>
            <Button type="button" onClick={() => onFilterTypeChange("income")}>
                收入
            </Button>
            <Button type="button" onClick={() => onFilterTypeChange("expense")}>
                支出
            </Button>
        </section>
    )
}