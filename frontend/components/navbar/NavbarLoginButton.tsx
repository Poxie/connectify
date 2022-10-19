import { useTranslation } from "next-i18next"
import Button from "../button"

export const NavbarLoginButton = () => {
    const { t } = useTranslation('common');
    return(
        <Button>
            {t('navbar.signIn')}
        </Button>
    )
}