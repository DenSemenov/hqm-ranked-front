import $api from "../http";
import { AxiosResponse } from 'axios'
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest";
import { ISeasonResponse } from "models/ISeasonResponse";
import { ISeasonStatsResponse } from "models/ISeasonStatsResponse";

export default class SeasonService {
    static async getSeasons(): Promise<AxiosResponse<ISeasonResponse[]>> {
        return $api.post<ISeasonResponse[]>('api/seasons/GetSeasons');
    }

    static async getSeasonsStats(data: ICurrentSeasonStatsRequest): Promise<AxiosResponse<ISeasonStatsResponse[]>> {
        return $api.post<ISeasonStatsResponse[]>('api/seasons/GetSeasonStats', data);
    }
}
