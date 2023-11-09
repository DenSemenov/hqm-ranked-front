import { Col, Row } from "antd";
import PlayersTable from "./PlayersTable";
import Servers from "./Servers";
import Games from "./Games";
import Ads from "./Ads";
import { useEffect, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import CardComponent, { EdgeType } from "shared/CardComponent";
import styles from './HomePage.module.css'

const HomePage = () => {
    const [height, setHeight] = useState<number>(0);


    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, []);

    const setTableHeightAction = () => {
        let h = document.body.clientHeight - 142 - 32 - 100 - 32 * 2;
        setHeight(h);
    }

    return (
        <>
            <BrowserView>
                <Row gutter={[32, 32]}>
                    <Col sm={14} xs={24} style={{ height: height }} >
                        <CardComponent edges={[EdgeType.LeftBottom, EdgeType.RightTop]} >
                            <div className={styles.container}>
                                <PlayersTable full={false} />
                            </div>
                        </CardComponent>
                    </Col>
                    <Col sm={10} xs={24} style={{ height: height }}>
                        <CardComponent edges={[]}>
                            <div className={styles.container}>
                                <Games />
                            </div>
                        </CardComponent>
                    </Col>
                    <Col sm={14}>
                        <CardComponent edges={[EdgeType.LeftBottom, EdgeType.RightTop]}>
                            <Servers />
                        </CardComponent>
                    </Col>
                    <Col sm={10}>
                        <CardComponent edges={[]}>
                            <Ads />
                        </CardComponent>
                    </Col>
                </Row>
            </BrowserView>
            <MobileView>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <PlayersTable full={false} />
                    </Col>
                    <Col span={24}>
                        <div className={styles.mobileContainer}>
                            <Games />
                        </div>
                    </Col>
                    <Col span={24}>
                        <Servers />
                    </Col>
                    <Col span={24}>
                        <Ads />
                    </Col>
                </Row >
            </MobileView>
        </>
    )
}

export default HomePage;