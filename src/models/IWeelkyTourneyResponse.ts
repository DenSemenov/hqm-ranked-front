export interface IWeelkyTourneyResponse {
    state: WeeklyTourneyState;
    startDate: Date;
    registration?: IWeeklyTourneyRegistration
    tourney?: IWeeklyTourney
}

export interface IWeeklyTourneyRegistration {
    tourneyId: string;
    tourneyName: string;
    weekNumber: number;
    players: IWeeklyTourneyRegistrationPlayer[]
}

export interface IWeeklyTourney {
    tourneyId: string;
    tourneyName: string;
    weekNumber: number;
    rounds: number;
    games: IWeeklyTourneyGame[]
}

export interface IWeeklyTourneyGame {
    id: string;
    redTeamId: string;
    blueTeamId: string;
    redTeamName: string;
    blueTeamName: string;
    playoffType: number;
}

export interface IWeeklyTourneyRegistrationPlayer {
    id: number;
    name: string;
}


export enum WeeklyTourneyState {
    Registration,
    Running,
    Canceled,
    Finished
}