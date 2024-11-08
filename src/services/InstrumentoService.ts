import Instrumento from "../entities/Instrumento";
import BaseService from "./BaseService";

export default class InstrumentoService extends BaseService<Instrumento> {
    async postFormData(url: string, formData: FormData): Promise<any> {
        return this.saveWithFile(url, formData);
    }

    async getBySucursalId(url: string, idSucursal: number):
        Promise<Instrumento[]> {
        const path = `${url}/sucursal/${idSucursal}`;
        const options: RequestInit = {
            method: "GET"
        };
        return this.requestAll(path, options);
    }
}
