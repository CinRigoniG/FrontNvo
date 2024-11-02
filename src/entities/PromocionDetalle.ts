import Instrumento from "./Instrumento";

export class PromocionDetalle{
    id?:number;
    cantidad: number = 0;
    instrumento:Instrumento = new Instrumento();
}