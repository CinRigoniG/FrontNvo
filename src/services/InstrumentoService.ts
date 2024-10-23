import Instrumento from "../entities/Instrumento";
import BaseService from "./BaseService";

export default class InstrumentoService extends BaseService<Instrumento> {
    async postFormData(url: string, formData: FormData): Promise<any> {
        return this.saveWithFile(url, formData);
    }
}
