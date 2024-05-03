export interface IHeartbeatResponse {
    id: string;
    name: string;
    loggedIn: number;
    teamMax: number;
    period: number;
    time: number;
    redScore: number;
    blueScore: number;
    state: number;
}