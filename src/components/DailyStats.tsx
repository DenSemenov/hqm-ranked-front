import Chart from 'react-apexcharts';
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectHomeStats } from "stores/season";
import { Typography } from 'antd';
import { orderBy } from 'lodash';

const { Text, Title } = Typography;

const DailyStats = () => {
    const homeStats = useSelector(selectHomeStats);

    const [height, setHeight] = useState<number>(250);

    useEffect(() => {
        setHeightAction();
        window.addEventListener('resize', setHeightAction, true);
    }, [])

    const setHeightAction = () => {
        const gc = document.getElementById("stats-container");
        if (gc) {
            let h = gc.clientHeight - 64;
            setHeight(h);
        }
    }

    const data = useMemo(() => {
        const offset = new Date().getTimezoneOffset();
        const hourOffset = offset / 60;
        const items = homeStats.daily.map(x => {
            let h = x.hour - hourOffset;
            if (h > 24) {
                h = h - 24;
            }
            return {
                hour: h,
                count: x.count
            }
        })

        return orderBy(items, "hour");
    }, [homeStats.daily])

    return (
        <>
            <Title level={3} style={{ display: "flex", alignItems: "center" }}>
                Most played daily hours
            </Title>
            <Chart
                type="bar"
                options={{
                    xaxis: {
                        categories: data.map(hour => { return hour.hour }),
                    },
                    yaxis: {
                        show: false,
                    },
                    markers: {
                        strokeWidth: 0
                    },
                    tooltip: {
                        enabled: false
                    },
                    dataLabels: {
                        enabled: false
                    },
                }}
                height={height}
                series={[{
                    name: "",
                    data: data.map(hour => { return hour.count }),
                }]}
            />
        </>
    )
}

export default DailyStats;