export interface IWeelkyTourneyResponse {
    state: WeeklyTourneyState;
    registration?: IWeeklyTourneyRegistration
    tourney?: IWeeklyTourney
}

export interface IWeeklyTourneyRegistration {
    tourneyId: string;
    tourneyName: string;
    weekNumber: number;
    players: IWeeklyTourneyRegistrationPlayer[]
    parties: IWeeklyTourneyRegistrationParty[]
    allPlayers: IWeeklyTourneyRegistrationPlayer[]
}

export interface IWeeklyTourneyRegistrationParty {
    partyId: string;
    players: IWeeklyTourneyRegistrationPlayer[]
}

export interface IWeeklyTourney {
    tourneyId: string;
    tourneyName: string;
    weekNumber: number;
    rounds: number;
    games: IWeeklyTourneyGame[]
    teams: IWeeklyTourneyTeam[]
}

export interface IWeeklyTourneyTeam {
    id: string;
    name: string;
    players: IWeeklyTourneyTeamPlayer[]
}

export interface IWeeklyTourneyTeamPlayer {
    id: number;
    name: string;
    gp: number;
    goals: number;
    assists: number;
    points: number;
}

export interface IWeeklyTourneyGame {
    id: string;
    nextGameId?: string;
    redTeamId: string;
    blueTeamId: string;
    redTeamName: string;
    blueTeamName: string;
    playoffType: number;
    redScore: number;
    blueScore: number;
    index: number;
    state: string;
}

export interface IWeeklyTourneyRegistrationPlayer {
    id: number;
    name: string;
    state: WeeklyTourneyPartyPlayerState
}

export enum WeeklyTourneyPartyPlayerState {
    Host,
    Waiting,
    Accepted
}

export enum WeeklyTourneyState {
    Registration,
    Running,
    Canceled,
    Finished
}