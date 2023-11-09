import CardComponent from 'shared/CardComponent';
import styles from './Ads.module.css'
import { Button } from 'antd';
import { BrowserView } from 'react-device-detect';

const Ads = () => {
    return (
        <div className={styles.adsContainer}>
            <div className={styles.adsContent}>
                <div className={styles.discordContainer}>
                    <svg height="36" width="36">
                        <image href="/icons/discord-white.svg" height="36" width="36" />
                    </svg>
                </div>
                <div>
                    OUR DISCORD
                    <br />
                    CHANNEL
                </div>
                <div className={styles.comeToUs}>
                    COME TO
                    <br />
                    US
                </div>
            </div>
        </div >
    )
}

export default Ads;