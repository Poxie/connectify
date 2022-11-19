import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useToast } from "../../contexts/toast/ToastProvider";
import { updatePost } from "../../redux/posts/actions";
import { Post } from "../../types";
import { Dropdown } from "../dropdown";

export const UserPostVisibilty: React.FC<{
    postId: number;
    privacy?: Post['privacy'];
}> = ({ privacy, postId }) => {
    const { t } = useTranslation('common');
    const { patch } = useAuth();
    const { setToast } = useToast();
    const dispatch = useDispatch();
    const [hasBeenPrivate, setHasBeenPrivate] = useState(privacy === 'private');

    if(!hasBeenPrivate) return null;

    const updatePrivacy = async (id: string) => {
        if(id === privacy) return;

        const data = patch(`/posts/${postId}`, {
            privacy: id
        }).catch(error => {
            setToast(t('visibility.error'), 'error');
        })
        if(!data) return;

        setToast(t('visibility.success'), 'success');
        dispatch(updatePost(postId, { privacy: id as Post['privacy'] }));
    }

    return(
        <>
        <Dropdown 
            items={[
                { text: t('visibility.all'), id: 'all' },
                { text: t('visibility.semi'), id: 'semi' },
                { text: t('visibility.private'), id: 'private' }
            ]}
            defaultActive={privacy}
            onChange={updatePrivacy}
        />
        </>
    )
}