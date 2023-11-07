import CardComponent, { EdgeType } from "shared/CardComponent";
import styles from './Events.module.css'

const Events = () => {
    return (
        <div className={styles.eventsContainer}>
            <CardComponent edges={[EdgeType.LeftTop]}>
                <div className={styles.eventsContent}>

                </div>
            </CardComponent>
        </div>
    )
}

export default Events;