import { Sucursal } from "./Sucursal";

export default class Empresa {
    id?: number;
    nombre: string = '';
    razonSocial: string = '';
    imagenEmpresa: string = '';
    cuit: number = 0;
    telefono: string = '';
    gmail: string = '';
    sucursales : Sucursal[] = [];
}