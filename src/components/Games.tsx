import CardComponent from "shared/CardComponent";
import styles from './Games.module.css'

const Games = () => {
    return (
        <div className={styles.gamesContainer}>
            <CardComponent edges={[]}>
                <div className={styles.gamesContent}>
                    <span style={{ fontSize: 16 }}>LAST GAMES:</span>
                </div>
            </CardComponent>
        </div>
    )
}

export default Games;