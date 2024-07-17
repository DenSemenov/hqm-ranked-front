import $api from "../http";
import { AxiosResponse } from 'axios'
import { IContractResponse } from "models/IContractResponse";

export default class ContractService {
    static async getContracts(): Promise<AxiosResponse<IContractResponse[]>> {
        return $api.post<IContractResponse[]>('api/contract/GetContracts');
    }
}