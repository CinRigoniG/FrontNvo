import PreferenceMP from "../entities/MercadoPago/PreferenceMP";
import Pedido from "../entities/Pedido";
import { AbstractBaseService } from "./AbstractBaseService";

export default abstract class BaseService<T> extends AbstractBaseService<T> {

  protected async request(path: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(path, options);
      if (!response.ok) {
        console.log(response.statusText);
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected async requestAll(path: string, options: RequestInit): Promise<T[]> {
    try {
      const response = await fetch(path, options);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async get(url: string, id: number): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "GET",
    };
    return this.request(path, options);
  }

  async getAll(url: string): Promise<T[]> {
    const path = url;
    const options: RequestInit = {
      method: "GET",
    };
    return this.requestAll(path, options);
  }

  async post(url: string, data: T): Promise<T> {
    const path = url;
    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  async put(url: string, id: number, data: T): Promise<T> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    return this.request(path, options);
  }

  async delete(url: string, id: number): Promise<void> {
    const path = `${url}/${id}`;
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await fetch(path, options);
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
      throw new Error("Error al eliminar el elemento");
    }
  }

  // Método especializado para manejar FormData
  async saveWithFile(url: string, formData: FormData): Promise<string> {
    try {
        const options: RequestInit = {
            method: 'POST',
            body: formData
        };
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Error al guardar la imagen del instrumento: ${response.statusText}`);
        }

        return response.text(); // Devuelve la respuesta del servidor
    } catch (error) {
        throw new Error(`Error al guardar la imagen del instrumento`);
    }
  } 



  async createPreferenceMP(pedido: Pedido): Promise<PreferenceMP> {
    const urlServer = 'https://depositoback-production.up.railway.app/api/mercado_pago/create_preference';
    try {
      const response = await fetch(urlServer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
      });
      if (!response.ok) {
        throw new Error(`Error al crear preferencia de Mercado Pago: ${response.statusText}`);
      }
      const responseData = await response.json();
      console.log('Respuesta de la API:', responseData);
      return responseData as PreferenceMP;
    } catch (error) {
      console.error('Error en createPreferenceMP:', error);
      throw error;
    }
  }
}
