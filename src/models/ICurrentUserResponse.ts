export interface ICurrentUserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    isBanned: boolean;
    isAcceptedRules: boolean;
    discordLogin: string;
    showLocation: boolean;
    limitType: LimitType
    limitTypeValue: number;
}

export enum LimitType {
    Default,
    New,
    None
}