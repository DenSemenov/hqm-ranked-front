import { isMobile } from 'react-device-detect';
import styles from './Events.module.css'
import { Card, Col, List, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { getCurrentEvent } from 'stores/events/async-actions';
import { selectCurrentEvent } from 'stores/events';
import { useSelector } from 'react-redux';
import PlayerItem from 'shared/PlayerItem';

const { Text, Title } = Typography;

const Events = () => {
    const dispatch = useAppDispatch();

    const currentEvent = useSelector(selectCurrentEvent);

    useEffect(() => {
        dispatch(getCurrentEvent())
    }, [])

    return (
        <Card title={!isMobile ? "Events" : undefined} bordered={false} style={{ height: !isMobile ? 268 : undefined, width: "100%" }}>
            {currentEvent &&
                <>
                    <Row>
                        <Col span={16}>
                            <Title level={5}>{currentEvent.text}</Title>
                        </Col>
                        <Col span={8} className='right-align'>
                            <Text type="secondary">{currentEvent.left}</Text>
                        </Col>
                        <Col span={24}>
                            <List
                                itemLayout="horizontal"
                                dataSource={currentEvent.players}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <PlayerItem id={item.id} name={item.name} />
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>

                </>
            }
        </Card>
    )
}

export default Events;