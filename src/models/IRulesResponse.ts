export interface IRulesResponse {
    text: string;
    rules: IRulesItemResponse[]
}

export interface IRulesItemResponse {
    title: string;
    description: string;
}