// AfipService.ts
interface DatosComprobante {
    cuitCliente: number;
    ptoVenta: number;
    comprobante: number;
    concepto: number;
    tipoDoc: number;
    nroDoc: number;
    importeGravado: number;
    importeIva: number;
    importeExentoIva: number;
}

const AfipService = () => {
    const generarComprobante = async (datosComprobante: DatosComprobante): Promise<any> => {
        try {
            const response = await fetch('http://localhost:3000/api/generarComprobante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosComprobante),
            });

            if (!response.ok) {
                throw new Error('Error al generar el comprobante');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { generarComprobante };
};

export default AfipService;
