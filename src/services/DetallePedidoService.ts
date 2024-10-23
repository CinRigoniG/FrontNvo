import DetallePedido from "../entities/DetallePedido";
import BaseService from "./BaseService";

export default class DetallePedidoService extends BaseService<DetallePedido>{

    async getByPedidoId(url: string, idPedido: number): Promise<DetallePedido[]> {
        const path = `${url}/pedido/${idPedido}`;
        const options: RequestInit = {
            method: "GET"
        };
        return this.requestAll(path, options);
    }

}