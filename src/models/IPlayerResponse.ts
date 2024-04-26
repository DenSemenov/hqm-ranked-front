export interface IPlayerResponse {
    id: number;
    name: string;
    games: number;
    goals: number;
    assists: number;
    points: number;
    currentSeasonData: PlayerLastSeasonViewModel;
    lastGames: PlayerLastGamesViewModel[];
    lastSeasons: PlayerSeasonsViewModel[];
    calcData: PlayerCalcDataViewModel;
}

export interface PlayerLastSeasonViewModel {
    position: number;
    games: number;
    goals: number;
    assists: number;
    points: number;
    elo: number;
}

export interface PlayerSeasonsViewModel {
    name: string;
    place: number;
}

export interface PlayerLastGamesViewModel {
    gameId: string;
    redScore: number;
    blueScore: number;
    date: Date;
    goals: number;
    assists: number;
    teamRedId: number;
    teamBlueId: number;
    teamRedName: string;
    teamBlueName: string;
    team: number;
}

export interface PlayerCalcDataViewModel {
    shots: number;
    dribbling: number;
    passes: number;
    longShots: number;
    tackling: number;
    pressing: number;
    blocks: number;
    interception: number;
    highBlocks: number;
    lowBlocks: number;
    oneByOne: number;
    gateLeaving: number;
}