import CardComponent, { EdgeType } from 'shared/CardComponent';
import styles from './Servers.module.css'
import { Col, Row, Tag } from 'antd';
import { selectServers } from 'stores/server';
import { useSelector } from 'react-redux';

const Servers = () => {
    const servers = useSelector(selectServers);

    return (
        <div className={styles.serversContainer} >
            <CardComponent edges={[EdgeType.LeftBottom, EdgeType.RightTop]}>
                <div className={styles.serversContent}>
                    <Row style={{ height: "100%" }} gutter={[8, 8]}>
                        <Col span={6} className={styles.serversFlex}>
                            <span >SERVERS:</span>
                            <div style={{ display: "flex", alignContent: "center" }}>
                                <svg height="24" width="24">
                                    <image href="/icons/servers.svg" height="24" width="24" />
                                </svg>
                                <Tag style={{ background: "var(--semantic-success)", color: "var(--layout)" }}>{servers.length}</Tag>
                            </div>
                        </Col>
                        {servers.map((server, index) =>
                            <Col span={6} className={styles.serversFlex}>
                                <span >{server.name}</span>
                                <span style={{ color: "var(--primary)" }}>
                                    {server.count + " PLAYERS"}
                                </span>
                            </Col>
                        )}
                    </Row>

                </div>
            </CardComponent>
        </div>
    )
}

export default Servers;