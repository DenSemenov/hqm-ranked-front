import CardComponent, { EdgeType } from 'shared/CardComponent';
import styles from './Servers.module.css'
import { Col, Row, Tag } from 'antd';

const Servers = () => {
    return (
        <div className={styles.serversContainer} >
            <CardComponent edges={[EdgeType.LeftBottom, EdgeType.RightTop]}>
                <div className={styles.serversContent}>
                    <Row style={{ height: "100%" }} gutter={[8, 8]}>
                        <Col span={6} className={styles.serversFlex}>
                            <span >SERVERS:</span>
                        </Col>
                        <Col span={6} className={styles.serversFlex}>
                            <span >Name</span>
                        </Col>
                        <Col span={6} className={styles.serversFlex}>
                            <span >Name</span>
                        </Col>
                        <Col span={6} className={styles.serversFlex}>
                            <span >Name</span>
                        </Col>
                        <Col span={6} className={styles.serversFlex}>
                            <svg height="24" width="24">
                                <image href="/icons/servers.svg" height="24" width="24" />
                            </svg>
                            <Tag style={{ background: "var(--semantic-success)", color: "var(--layout)" }}>3</Tag>
                        </Col>
                        <Col span={6} className={styles.serversFlex}>
                            <span style={{ color: "var(--primary)" }}>
                                8 PLAYERS
                            </span>
                        </Col>
                        <Col span={6} className={styles.serversFlex}>
                            <span style={{ color: "var(--primary)" }}>
                                8 PLAYERS
                            </span>
                        </Col>
                        <Col span={6} className={styles.serversFlex}>
                            <span style={{ color: "var(--primary)" }}>
                                8 PLAYERS
                            </span>
                        </Col>
                    </Row>

                </div>
            </CardComponent>
        </div>
    )
}

export default Servers;