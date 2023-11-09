import { Col, Row, Select } from 'antd';
import styles from './MobileHeader.module.css'
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectSeasons, selectCurrentSeason, setCurrentSeason } from 'stores/season';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import ThemeButton from './ThemeButton';

const MobileHeader = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const seasons = useSelector(selectSeasons);
    const currentSeason = useSelector(selectCurrentSeason);

    const seasonItems = useMemo(() => {
        return seasons.map(x => {
            return {
                value: x.id,
                label: x.name,
            }
        })
    }, [seasons]);

    return (
        <Row className={styles.mobileHeader}>
            <Col span={8}>
                <span onClick={() => navigate("/")}>
                    <svg height="36" width="36">
                        <image href="/icons/logo.svg" height="36" width="36" />
                    </svg>
                </span>
            </Col>
            <Col span={8} className='center-align'>
                <Select
                    onChange={(value: string) => dispatch(setCurrentSeason(value))}
                    value={currentSeason}
                    options={seasonItems}
                />
            </Col>
            <Col span={8} className='right-align'>
                <ThemeButton />
            </Col>
        </Row>
    )
}

export default MobileHeader;