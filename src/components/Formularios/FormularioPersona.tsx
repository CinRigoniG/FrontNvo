import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Persona from "../../entities/Persona";
import { useEffect, useState } from "react";
import PersonaService from "../../services/PersonaService";


const FormularioPersona = () => {

    const navigate = useNavigate();
    const { idPersona = '0' } = useParams();
    const personaId = idPersona ? parseInt(idPersona, 10) : 0;
    const { usuarioL } = useUser(); //Usuario logueado contexto
    const [personaObjeto, setPersonaObjeto] = useState<Persona>(new Persona());
    const [txtValidacion, setTxtValidacion] = useState<String>('');
    const personaService = new PersonaService();

    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            await getPersona();
        };
        fetchData();
    }, [idPersona]);

    const getPersona = async () => {
        console.log(idPersona);
        if(personaId > 0){
            try{
                const personaId = idPersona ? parseInt(idPersona, 10) : 0;
                const personaSelect = await personaService.get(url + 'persona', personaId);
                if(personaSelect) {
                    setPersonaObjeto(personaSelect);
                    console.log(personaSelect);
                }else{
                    setTxtValidacion('No se encontró la persona con el ID proporcionado')
                }
            }catch (error) {
                setTxtValidacion('Error al obtener los datos de la persona.')
                console.log(error);
            }
        }else{
            setPersonaObjeto(new Persona());
        }
    }

    const save = async () => {
        try{
            console.log(personaObjeto);
            if(personaObjeto.nombre.length === 0)
        }
    }

}

export default FormularioPersona;