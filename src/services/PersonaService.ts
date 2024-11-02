import Persona from "../entities/Persona";
import BaseService from "./BaseService";

export default class PersonaService extends BaseService<Persona> {
    async getPersonaByUsuarioId(url: string, usuarioId: number): Promise<Persona | null> {
        try {
            const response = await fetch(`${url}/usuario/${usuarioId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error(`Error fetching Persona by usuarioId: ${response.statusText}`);
                return null;
            }

            const persona = await response.json();
            return persona ? persona : null;
        } catch (error) {
            console.error("Error fetching Persona by usuarioId:", error);
            return null;
        }
    }
}
