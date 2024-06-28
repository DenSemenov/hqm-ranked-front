import { List, Tag, Typography } from "antd";
import { IBudgetType } from "models/IBudgetType";
import { ITeamBudgetHistoryItemResponse } from "models/ITeamResponse";
import { convertMoney } from "shared/MoneyCoverter";
import PlayerItem, { PlayerItemType } from "shared/PlayerItem";
import styles from './Budget.module.css'
import { convertDate } from "shared/DateConverter";

const { Text, Title } = Typography;

interface IProps {
    items: ITeamBudgetHistoryItemResponse[];
}

const Budget = ({ items }: IProps) => {

    const getBudgetType = (historyItem: ITeamBudgetHistoryItemResponse) => {
        switch (historyItem.type) {
            case IBudgetType.Start:
                return <span>Start budget</span>;
            case IBudgetType.Invite:
                return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>Invited player</span>
                    <PlayerItem id={historyItem.invitedPlayerId as number} name={historyItem.invitedPlayerNickname as string} type={PlayerItemType.Name} />
                </div>;
            case IBudgetType.Leave:
                return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PlayerItem id={historyItem.invitedPlayerId as number} name={historyItem.invitedPlayerNickname as string} type={PlayerItemType.Name} />
                    <span>left the team</span>
                </div>;
            case IBudgetType.Sell:
                return <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PlayerItem id={historyItem.invitedPlayerId as number} name={historyItem.invitedPlayerNickname as string} type={PlayerItemType.Name} />
                    <span>sold</span>
                </div>;
            case IBudgetType.Game:
                return <span>Game bonus</span>;
        }
    }

    return <List
        itemLayout="horizontal"
        bordered
        style={{ maxHeight: 400, overflow: "auto" }}
        dataSource={items}
        renderItem={(item, index) => (
            <List.Item className={styles.budgetHistoryItem}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{getBudgetType(item)}</span>
                    <Text type="secondary">{convertDate(item.date)}</Text>
                </div>
                <Tag color={item.change > 0 ? "success" : "error"}>{item.change > 0 ? "+" + convertMoney(item.change) : convertMoney(item.change)}</Tag>
            </List.Item>
        )}
    />
}

export default Budget;