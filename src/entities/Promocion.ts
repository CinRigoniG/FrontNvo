import { PromocionDetalle } from "./PromocionDetalle";

export class Promocion{
    id?: number;
    denominacion:string = '';
    fechaDesde:string = '';
    fechaHasta:string = '';
    descripcionDescuento:string = '';
    precioPromocional:number=0;
    promocionDetalle: PromocionDetalle[] = [];
}