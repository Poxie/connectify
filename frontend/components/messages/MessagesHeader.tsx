import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowIcon } from '../../assets/icons/ArrowIcon';
import { useScreenType } from '../../hooks/useScreenType';
import { HasPopout } from '../../popouts/HasPopout';
import { UserPopout } from '../../popouts/user/UserPopout';
import styles from '../../styles/Messages.module.scss';
import { User } from '../../types';

export const MessagesHeader: React.FC<{
    recipient: User;
}> = ({ recipient }) => {
    const screenType = useScreenType();
    const router = useRouter();

    // Function to go back
    const goBack = () => {
        router.push(`/messages`);
    }

    return(
        <div className={styles['header']}>
            {screenType !== 'large' && (
                <div 
                    className={styles['back-button']}
                    onClick={goBack}
                >
                   <ArrowIcon /> 
                </div>
            )}

            <span>
                Direct messages with
            </span>
                
            <HasPopout popout={<UserPopout {...recipient} />}>
                <Link href={`/users/${recipient.id}`}>
                    <a>
                        <strong>
                            {recipient.display_name || recipient.username}
                        </strong>
                    </a>
                </Link>
            </HasPopout>
        </div>
    )
}