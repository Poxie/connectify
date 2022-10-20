import { useTranslation } from "next-i18next"
import { useModal } from "../../contexts/modal/ModalProvider";
import { LoginModal } from "../../modals/login/LoginModal";
import Button from "../button"

export const NavbarLoginButton = () => {
    const { t } = useTranslation('common');
    const { setModal } = useModal();
    return(
        <Button onClick={() => setModal(<LoginModal />)}>
            {t('navbar.signIn')}
        </Button>
    )
}