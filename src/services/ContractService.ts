import $api from "../http";
import { AxiosResponse } from 'axios'
import { IContractResponse } from "models/IContractResponse";
import { ISelectContractRequest } from "models/ISelectContractRequest";

export default class ContractService {
    static async getContracts(): Promise<AxiosResponse<IContractResponse[]>> {
        return $api.post<IContractResponse[]>('api/contract/GetContracts');
    }
    static async selectContract(data: ISelectContractRequest): Promise<AxiosResponse> {
        return $api.post('api/contract/SelectContract', data);
    }
    static async getCoins(): Promise<AxiosResponse<number>> {
        return $api.post<number>('api/contract/GetCoins');
    }
}