import CardComponent from 'shared/CardComponent';
import styles from './Ads.module.css'
import { Button } from 'antd';

const Ads = () => {
    return (
        <div className={styles.adsContainer}>
            <CardComponent edges={[]}>
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
                    <div>
                        <Button style={{ width: " 150px" }}>SUPPORT</Button>
                        <br />
                        <br />
                        <Button style={{ width: " 150px" }}>VIDEOS</Button>
                    </div>
                    <div>
                        <Button style={{ width: " 150px" }}>CHATTING</Button>
                        <br />
                        <br />
                        <Button style={{ width: " 150px" }}>NEWS</Button>
                    </div>
                    <div className={styles.comeToUs}>
                        COME TO
                        <br />
                        US
                    </div>
                </div>
            </CardComponent >
        </div >
    )
}

export default Ads;