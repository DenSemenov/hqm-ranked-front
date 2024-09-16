import { useAppDispatch } from "hooks/useAppDispatch";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getWeeklyTourney } from "stores/weekly-tourney/async-actions";
import { LoadingOutlined } from "@ant-design/icons";
import { selectWeeklyTourney } from "stores/weekly-tourney";
import { useSelector } from "react-redux";
import { WeeklyTourneyState } from "models/IWeelkyTourneyResponse";
import WeeklyTourneyRegistration from "./WeeklyTourneyRegistration";
import WeeklyTourneyTable from "./WeeklyTourneyTable";
import { Typography } from "antd";

const { Text, Title } = Typography;

const WeeklyTourneyComponent = () => {
    const dispatch = useAppDispatch();

    const weeklyTourney = useSelector(selectWeeklyTourney);

    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const id = searchParams.get("id");
        if (id) {
            dispatch(getWeeklyTourney({
                id: id
            })).unwrap().then(() => {
                setLoading(false);
            })
        }
    }, [searchParams]);

    const content = useMemo(() => {
        switch (weeklyTourney.state) {
            case WeeklyTourneyState.Registration:
                return <WeeklyTourneyRegistration />
            case WeeklyTourneyState.Finished:
            case WeeklyTourneyState.Running:
                return <WeeklyTourneyTable />
            default:
                return <div className='content-loading-in'>
                    <Title level={3}>Canceled</Title>
                </div>
        }
    }, [weeklyTourney])

    return loading ? <div className='content-loading-in'>
        <LoadingOutlined style={{ fontSize: 64 }} />
    </div> : content
}

export default WeeklyTourneyComponent;