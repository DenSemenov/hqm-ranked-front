import { Col, Radio, Row } from "antd";
import PlayersTable from "./PlayersTable";
import Games from "./Games";
import { useEffect, useMemo, useState } from "react";
import styles from './HomePage.module.css'
import { MobileView } from "react-device-detect";
import { isMobile } from "react-device-detect";

const HomePage = () => {
    const [height, setHeight] = useState<number>(0);
    const [selectedTab, setSelectedTab] = useState<string>("Players");


    useEffect(() => {
        setTableHeightAction();
        window.addEventListener('resize', setTableHeightAction, true);
    }, []);

    const setTableHeightAction = () => {
        let h = document.body.clientHeight - 42 - 32 - 16 * 2;
        setHeight(h);
    }

    const tabs = useMemo(() => {
        return [
            { label: 'Players', value: 'Players' },
            { label: 'Games', value: 'Games' },
        ]
    }, [])

    const getContent = useMemo(() => {
        if (isMobile) {
            switch (selectedTab) {
                case "Players":
                    return <PlayersTable full={false} />
                case "Games":
                    return <Games />
            }
        } else {
            return <><Col span={14} style={{ height: height }} >
                <PlayersTable full={false} />
            </Col>
                <Col span={10} style={{ height: height }}>
                    <Games />
                </Col>
            </>
        }

    }, [isMobile, height, selectedTab])

    return (
        <Row gutter={[32, 32]}>
            {getContent}
            <MobileView renderWithFragment>
                <div className={styles.tabs}>
                    <Radio.Group
                        optionType="button"
                        options={tabs}
                        onChange={(e) => setSelectedTab(e.target.value)}
                        value={selectedTab}
                    />
                </div>
            </MobileView>
        </Row>
    )
}

export default HomePage;