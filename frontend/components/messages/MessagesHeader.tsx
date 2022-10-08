import Link from 'next/link';
import { HasPopout } from '../../popouts/HasPopout';
import { UserPopout } from '../../popouts/user/UserPopout';
import styles from '../../styles/Messages.module.scss';
import { User } from '../../types';

export const MessagesHeader: React.FC<{
    recipient: User;
}> = ({ recipient }) => {
    return(
        <span className={styles['header']}>
            Direct messages with
            
            <HasPopout popout={<UserPopout {...recipient} />}>
                <Link href={`/users/${recipient.id}`}>
                    <a>
                        <strong>
                            {recipient.display_name || recipient.username}
                        </strong>
                    </a>
                </Link>
            </HasPopout>
        </span>
    )
}