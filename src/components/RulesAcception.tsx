import { Button, Card, Typography } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectRules } from "stores/season";
import { getRules } from "stores/season/async-actions";
import styles from './RulesAcception.module.css'
import { acceptRules, getCurrentUser } from "stores/auth/async-actions";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "stores/auth";

const { Text, Title } = Typography;

const RulesAcception = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const rules = useSelector(selectRules);
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        dispatch(getRules());
    }, []);

    useEffect(() => {
        dispatch(getRules());
    }, []);

    const onAcceptRules = () => {
        dispatch(acceptRules()).unwrap().then(() => {
            dispatch(getCurrentUser())
        });
    }

    return (
        <div className={styles.container}>
            <Title level={3}>Ban reasons</Title>
            {rules.rules.map(rule => {
                return <Card title={rule.title} >
                    <div style={{ padding: 16 }}>{rule.description}</div>
                </Card>
            })}
            <div dangerouslySetInnerHTML={{ __html: rules.text }} />
            <Button type={"primary"} onClick={onAcceptRules}>Accept rules</Button>
        </div>
    )
}

export default RulesAcception