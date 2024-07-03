import { Card, Col, List, Progress, Row, Typography } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { getCurrentEvent } from 'stores/events/async-actions';
import { selectCurrentEvent } from 'stores/events';
import { useSelector } from 'react-redux';
import PlayerItem from 'shared/PlayerItem';
import { ICurrentEventPlayerResponse } from 'models/ICurrentEventResponse';

const { Text, Title } = Typography;

const Events = () => {
    const dispatch = useAppDispatch();

    const currentEvent = useSelector(selectCurrentEvent);

    useEffect(() => {
        dispatch(getCurrentEvent())
    }, [])

    const getPercent = (item: ICurrentEventPlayerResponse) => {
        const total = currentEvent?.value ?? 0;
        let percent = Math.round(100 / total * item.currentValue);
        if (isNaN(percent)) {
            percent = 0;
        }

        return percent;
    }

    return (
        <>
            {currentEvent &&
                <Row style={{ height: "100%" }}>
                    <Col span={16}>
                        <Title level={5}>{currentEvent.text}</Title>
                    </Col>
                    <Col span={8} className='right-align'>
                        <Text type="secondary">{currentEvent.left}</Text>
                    </Col>
                    <Col span={24} style={{ height: "calc(-38px + 100%)" }}>
                        <List
                            itemLayout="horizontal"
                            style={{ height: "100%", overflow: "auto" }}
                            dataSource={currentEvent.players}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <PlayerItem id={item.id} name={item.name} />
                                    <Progress percent={getPercent(item)} style={{ width: 100 }} />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            }
        </>
    )
}

export default Events;