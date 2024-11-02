import Domicilio from "./Domicilio";
import Usuario from "./Usuario";

export default class Persona{
    id : number = 0;
    nombre : string = '';
    apellido : string = '';
    fechaNacimiento : Date = new Date();
    email : string = '';
    telefono : string = '';
    usuario : Usuario = new Usuario();
    domicilios : Domicilio[] = [];
}