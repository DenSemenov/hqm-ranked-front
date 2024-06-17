import { IInstanceType } from "./IInstanceType";

export interface IAdminServer {
    id: string;
    name: string;
    token: string;
    instanceType: IInstanceType
}