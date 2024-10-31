import Persona from "./Persona";

export default class Domicilio {
    id: number = 0;
    calle : String = '';
    numero : String = '';
    departamento : String = '';
    piso : String = '';
    barrio : String = '';
    codigoPostal : number = 0;
    localidad : String = '';
    provincia : String = '';
    pais : String = '';
    persona : Persona = new Persona();
}