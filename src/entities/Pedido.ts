import DetallePedido from "./DetallePedido";
import Usuario from "./Usuario";

export default class Pedido{
    id: number = 0;
    usuarioId: number = 0;
    fecha: Date = new Date();
    titulo: string = "";
    totalPedido: number = 0;
    detallePedido: DetallePedido[] = [];
    usuario: Usuario = new Usuario();
}