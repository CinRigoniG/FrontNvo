import Domicilio from "./Domicilio";
import Empresa from "./Empresa";
import Instrumento from "./Instrumento";
import { Promocion } from "./Promocion";


export class Sucursal {
    id?: number;
    nombre: string = '';
    horarioApertura: string = '';
    horarioCierre: string = '';
    numeroSucursal: number = 0;
    promociones: Promocion[] = [];
    domicilio: Domicilio = new Domicilio();
    empresa: Empresa = new Empresa();
    instrumentos: Instrumento[] = [];
}