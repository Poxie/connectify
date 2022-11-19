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
            setToast(`Something went wrong while updating visiblity.`, 'error');
        })
        if(!data) return;

        setToast(`Post visibility has been updated.`, 'success');
        dispatch(updatePost(postId, { privacy: id as Post['privacy'] }));
    }

    return(
        <>
        <Dropdown 
            items={[
                { text: 'Show in explore', id: 'all' },
                { text: 'Only on my profile', id: 'semi' },
                { text: 'No one can view', id: 'private' }
            ]}
            defaultActive={privacy}
            onChange={updatePrivacy}
        />
        </>
    )
}