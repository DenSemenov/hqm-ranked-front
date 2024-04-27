import $api from "../http";
import { AxiosResponse } from 'axios'
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest";
import { IGameRequest } from "models/IGameRequest";
import { IGameResponse } from "models/IGameResponse";
import { IPlayerRequest } from "models/IPlayerRequest";
import { IPlayerResponse } from "models/IPlayerResponse";
import { ISeasonGameResponse } from "models/ISeasonGameResponse";
import { ISeasonResponse } from "models/ISeasonResponse";
import { ISeasonStatsResponse } from "models/ISeasonStatsResponse";

export default class SeasonService {
    static async getSeasons(): Promise<AxiosResponse<ISeasonResponse[]>> {
        return $api.post<ISeasonResponse[]>('api/seasons/GetSeasons');
    }
    static async getSeasonsStats(data: ICurrentSeasonStatsRequest): Promise<AxiosResponse<ISeasonStatsResponse[]>> {
        return $api.post<ISeasonStatsResponse[]>('api/seasons/GetSeasonStats', data);
    }
    static async getSeasonsGames(data: ICurrentSeasonStatsRequest): Promise<AxiosResponse<ISeasonGameResponse[]>> {
        return $api.post<ISeasonGameResponse[]>('api/seasons/GetSeasonLastGames', data);
    }
    static async getPlayerData(data: IPlayerRequest): Promise<AxiosResponse<IPlayerResponse>> {
        return $api.post<IPlayerResponse>('api/seasons/GetPlayerData', data);
    }
    static async getGameData(data: IGameRequest): Promise<AxiosResponse<IGameResponse>> {
        return $api.post<IGameResponse>('api/seasons/GetGameData', data);
    }
}
