import { Sucursal } from "../entities/Sucursal";
import BaseService from "./BaseService";

export default class SucursalService extends BaseService<Sucursal>{
    
    async getByEmpresaId(url:string, idEmpresa: number):Promise<Sucursal[]>{
        const path = `${url}/empresa/${idEmpresa}`;
        const options: RequestInit = {
            method: "GET"
        };
        return this.requestAll(path, options);
    }

}