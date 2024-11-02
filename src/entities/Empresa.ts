import { Sucursal } from "./Sucursal";

export default class Empresa {
    id?: number;
    nombre: string = '';
    razonSocial: string = '';
    imagenEmpresa: string = '';
    cuit: number = 0;
    telefono: number = 0;
    gmail: string = '';
    sucursales : Sucursal[] = [];
}