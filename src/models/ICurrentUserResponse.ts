export interface ICurrentUserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    isBanned: boolean;
    isAcceptedRules: boolean;
}