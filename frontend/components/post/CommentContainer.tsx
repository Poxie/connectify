import { RefObject, useState } from "react";
import { Filters } from "../filters/Filters"
import styles from '../../styles/Post.module.scss';
import { useAppSelector } from "../../redux/store";
import { selectCommentIds, selectPostHasLoadedOrderType, selectPostIsFetched } from "../../redux/posts/selectors";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { Comment as CommentType } from "../../types";
import { useDispatch } from "react-redux";
import { setPostComments } from "../../redux/posts/actions";
import { Comment } from "./Comment";
import { CommentSkeleton } from "./CommentSkeleton";
import { useTranslation } from "next-i18next";
import { useQueryId } from "../../hooks/useQueryId";

const FETCH_AMOUNT = 15;
const SCROLL_THRESHOLD = 400;
const LOADING_SKELETON_COUNT = 3;
export const CommentContainer: React.FC<{
    containerRef?: RefObject<HTMLDivElement>;
}> = ({ containerRef }) => {
    const { t } = useTranslation('post');
    const postId = useQueryId('postId');
    const dispatch = useDispatch();
    const [orderType, setOrderType] = useState<CommentType['orderType']>('top');
    const hasLoadedOrderType = useAppSelector(state => selectPostHasLoadedOrderType(state, postId, orderType));
    const postIsFetched = useAppSelector(state => selectPostIsFetched(state, postId));
    const commentIds = useAppSelector(state => selectCommentIds(state, postId, orderType));

    // Fetching comments
    const onRequestFinished = (result: CommentType[]) => {
        dispatch(setPostComments(postId, result, orderType));
    }
    const { loading } = useInfiniteScroll(
        `/posts/${postId}/comments?amount=${FETCH_AMOUNT}&start_at=${commentIds.length}&order_by=${orderType}`,
        onRequestFinished,
        {
            fetchAmount: FETCH_AMOUNT,
            threshold: SCROLL_THRESHOLD,
            identifier: `${postId}-${orderType}`,
            fetchOnMount: !commentIds.length,
            standBy: postIsFetched === false || hasLoadedOrderType && !commentIds.length,
            scrollContainer: containerRef || undefined
        }
    )

    const _setOrderType = (type: string) => {
        setOrderType(type as CommentType['orderType']);
    }

    const FILTERS = [
        { text: t('topComments'), id: 'top' },
        { text: t('latestComments'), id: 'latest' }
    ]
    return(
        <>
            <Filters 
                items={FILTERS}
                defaultActive={orderType}
                containerClassName={styles['filters']}
                onChange={_setOrderType}
            />

            {commentIds.length !== 0 && (
                <ul>
                    {commentIds.map(id => (
                        <Comment 
                            id={id}
                            postId={postId}
                            key={id}
                        />
                    ))}
                </ul>
            )}

            {((!loading && postIsFetched) || hasLoadedOrderType) && !commentIds.length && (
                <span>
                    {t('noComments')}
                </span>
            )}

            {(loading || !postIsFetched) && !hasLoadedOrderType && Array.from(Array(LOADING_SKELETON_COUNT)).map((_, key) => (
                <CommentSkeleton key={key} />
            ))}
        </>
    )
}