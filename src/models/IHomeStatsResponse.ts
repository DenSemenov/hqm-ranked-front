export interface IHomeStatsResponse {
    daily: IHomeStatsDailyResponse[];
    weekly: IHomeStatsWeeklyResponse[];
}

export interface IHomeStatsDailyResponse {
    hour: number;
    count: number;
}

export interface IHomeStatsWeeklyResponse {
    day: any;
    count: number;
}