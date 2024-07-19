import { PlayerCalcStatsViewModel } from "./IPlayerResponse";

export interface IPlayerLiteDataResponse {
    id: number;
    name: string;
    gp: number;
    goals: number;
    assists: number;
    calcStats: PlayerCalcStatsViewModel;
}