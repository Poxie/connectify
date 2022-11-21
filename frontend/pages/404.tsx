import styles from '../styles/_404.module.scss'
import { GetStaticProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import Image from "next/image"
import Button from '../components/button'
import { useTranslation } from 'next-i18next'

export default function _404() {
    const { t } = useTranslation('_404');

    return(
        <div className={styles['container']}>
            <Image 
                src={require('../assets/imgs/404.png').default}
                layout={'fill'}
                objectFit={'cover'}
            />
            <div className={styles['text']}>
                <h2>
                    {t('header')}
                </h2>
                <span>
                    {t('subHeader')}
                </span>
                <Button href={'/'} className={styles['button']}>
                    {t('goHome')}
                </Button>
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    return{
        props: {
            ...(await serverSideTranslations(locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE, ['common', '_404']))
        }
    }
}