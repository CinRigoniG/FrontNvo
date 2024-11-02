import Pedido from "../entities/Pedido";
import BaseService from "./BaseService";

export default class PedidoService extends BaseService<Pedido>{
    
    async calcularTotal(url:string, idPedido: number): Promise<Pedido | null> {
        try {
            const response = await fetch(`${url}/total/${idPedido}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al calcular el total');
            }

            const pedido = await response.json();
            return pedido ? pedido : null;
        } catch (error) {
            console.error("Error en calcularTotal:", error);
            return null;
        }
    }
    
}