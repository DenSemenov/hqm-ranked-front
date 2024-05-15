import $api from "../http";
import { AxiosResponse } from 'axios'
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest";
import { IGameRequest } from "models/IGameRequest";
import { IGameResponse } from "models/IGameResponse";
import { IPlayerRequest } from "models/IPlayerRequest";
import { IPlayerResponse } from "models/IPlayerResponse";
import { IReplayChatMessage } from "models/IReplayChatMessage";
import { IReplayGoalResponse } from "models/IReplayGoalResponse";
import { IReplayRequest } from "models/IReplayRequest";
import { IReplayViewerRequest } from "models/IReplayViewerRequest";
import { IReplayViewerResponse } from "models/IReplayViewerResponse";
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
        return $api.post<ISeasonGameResponse[]>('api/seasons/GetSeasonGames', data);
    }
    static async getPlayerData(data: IPlayerRequest): Promise<AxiosResponse<IPlayerResponse>> {
        return $api.post<IPlayerResponse>('api/seasons/GetPlayerData', data);
    }
    static async getGameData(data: IGameRequest): Promise<AxiosResponse<IGameResponse>> {
        return $api.post<IGameResponse>('api/seasons/GetGameData', data);
    }
    static async getRules(): Promise<AxiosResponse<string>> {
        return $api.post<string>('api/seasons/GetRules');
    }
    static async getReplay(data: IReplayRequest): Promise<AxiosResponse<any>> {
        return $api.post<any>('api/replay/GetReplayData', data);
    }
    static async getReplayViewer(data: IReplayViewerRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayViewerResponse>('api/replay/GetReplayViewer', data);
    }
    static async getReplayGoals(data: IReplayRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayGoalResponse[]>('api/replay/GetReplayGoals', data);
    }
    static async getReplayChatMessages(data: IReplayRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayChatMessage[]>('api/replay/GetReplayChatMessages', data);
    }
    static async getStorage(): Promise<AxiosResponse<any>> {
        return $api.post<string>('api/seasons/GetStorage');
    }
}
