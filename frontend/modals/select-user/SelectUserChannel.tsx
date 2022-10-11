import { useRouter } from "next/router";
import { useModal } from "../../contexts/modal/ModalProvider";
import { selectChannelById } from "../../redux/messages/hooks";
import { useAppSelector } from "../../redux/store";
import { SelectUserItem } from "./SelectUserItem";

export const SelectUserChannel: React.FC<{
    id: number;
}> = ({ id }) => {
    const router = useRouter();
    const { close } = useModal();
    const channel = useAppSelector(state => selectChannelById(state, id));
    const recipient = channel?.recipients[0];
    if(!recipient) return null;

    const goToChannel = () => {
        router.push(`/messages/${id}`)
        close();
    }

    return(
        <SelectUserItem 
            user={recipient}
            onSelect={goToChannel}
        />
    )
}