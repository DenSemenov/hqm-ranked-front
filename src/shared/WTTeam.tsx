import { Tooltip, Avatar } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectStorageUrl, selectClearImageCache } from "stores/season";
import styles from './PlayerItem.module.css'
import { IWeeklyTourneyTeamPlayer } from "models/IWeelkyTourneyResponse";
import PlayerItem from "./PlayerItem";

export enum PlayerItemType {
    Both,
    Avatar,
    Name
}

interface IProps {
    id: string;
    key?: number;
    name: string;
    type?: PlayerItemType,
    crossed?: boolean;
    players?: IWeeklyTourneyTeamPlayer[]
}

const WTTeam = ({ id, name, key = 0, type = PlayerItemType.Both, crossed = false, players = [] }: IProps) => {

    const storageUrl = useSelector(selectStorageUrl);
    const clearImageCache = useSelector(selectClearImageCache);

    const avatarName = useMemo(() => {
        return name[0].toUpperCase()
    }, [name])

    const query = useMemo(() => {
        if (clearImageCache) {
            return clearImageCache.getTime();
        }
    }, [clearImageCache])

    return (
        <Tooltip arrow={false} title={<div>
            {players.map(x => {
                return <PlayerItem id={x.id} name={x.name} />
            })}
        </div>}>
            <div
                className={styles.playerItem + " " + (crossed ? styles.crossed : undefined)}
                key={key}
            >
                {(type === PlayerItemType.Both || type === PlayerItemType.Avatar) &&
                    <Tooltip title={type === PlayerItemType.Avatar ? name : undefined}>
                        <Avatar src={storageUrl + "images/" + id + ".png" + "?t=" + query}>{avatarName}</Avatar>
                    </Tooltip>
                }
                {(type === PlayerItemType.Both || type === PlayerItemType.Name) &&
                    name
                }
                {crossed &&
                    <div className={styles.crossed} />
                }
            </div>
        </Tooltip>
    )
}

export default WTTeam;