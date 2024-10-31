import Domicilio from "./Domicilio";
import Usuario from "./Usuario";

export default class Persona{
    nombre : String = '';
    apellido : String = '';
    fechaNacimiento : String = '';
    email : String = '';
    telefono : String = '';
    usuario : Usuario = new Usuario();
    domicilios : Domicilio[] = [];
}