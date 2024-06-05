export interface IRulesResponse {
    text: string;
    rules: IRulesItemResponse[]
}

export interface IRulesItemResponse {
    id: string;
    title: string;
    description: string;
}