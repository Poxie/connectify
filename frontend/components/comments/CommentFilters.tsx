import { useTranslation } from "next-i18next";
import { useMemo } from "react"
import { Comment } from "../../types";
import { Filters, FilterType } from "../filters/Filters"

export const CommentFilters: React.FC<{
    onOrderTypeChange: (id: Comment['orderType']) => void;
}> = ({ onOrderTypeChange }) => {
    const { t } = useTranslation('common');

    const items: FilterType[] = useMemo(() => [
        { text: t('topComments'), id: 'top' },
        { text: t('latestComments'), id: 'latest' }
    ], []);
    const onChange = (id: string) => {
        onOrderTypeChange(id as Comment['orderType'])
    }

    return(
        <Filters 
            items={items}
            onChange={onChange}
        />
    )
}