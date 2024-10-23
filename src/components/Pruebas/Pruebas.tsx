import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Afip from '@afipsdk/afip.js'; // Asegúrate de importar correctamente

const Pruebas = () => {
    const [lastVoucher, setLastVoucher] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [aux, setAux] = useState<string>('');

    const afip = new Afip({ CUIT: 20409378472 });
    /**
     * Numero del punto de venta..
     **/
    const puntoDeVenta = 1;

    /**
     * Tipo de factura
     **/
    const tipoDeComprobante = 1; // 1 = Factura A

    /**
     * Concepto de la factura
     *
     * Opciones:
     *
     * 1 = Productos 
     * 2 = Servicios 
     * 3 = Productos y Servicios
     **/
    const concepto = 1;

    /**
     * Tipo de documento del comprador
     *
     * Opciones:
     *
     * 80 = CUIT 
     * 86 = CUIL 
     * 96 = DNI
     * 99 = Consumidor Final 
     **/
    const tipoDeDocumento = 80;

    /**
     * Numero de documento del comprador (0 para consumidor final)
     **/
    const numeroDeDocumento = 33693450239;

    /**
     * Numero de factura
     **/
    const numeroDeFactura = lastVoucher !== null ? lastVoucher + 1 : 1; // Default to 1 if lastVoucher is null

    /**
     * Fecha de la factura en formato aaaa-mm-dd (hasta 10 dias antes y 10 dias despues)
     **/
    const fecha = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    /**
     * Importe sujeto al IVA (sin icluir IVA)
     **/
    const importeGravado = 100;

    /**
     * Importe exento al IVA
     **/
    const importeExentoIva = 0;

    /**
     * Importe de IVA
     **/
    const importeIva = 21;

    let fechaServicioDesde = null, fechaServicioHasta = null, fechaVencimientoPago = null;

    const data = {
        'CantReg': 1, // Cantidad de facturas a registrar
        'PtoVta': puntoDeVenta,
        'CbteTipo': tipoDeComprobante,
        'Concepto': concepto,
        'DocTipo': tipoDeDocumento,
        'DocNro': numeroDeDocumento,
        'CbteDesde': numeroDeFactura,
        'CbteHasta': numeroDeFactura,
        'CbteFch': parseInt(fecha.replace(/-/g, '')),
        'FchServDesde': fechaServicioDesde,
        'FchServHasta': fechaServicioHasta,
        'FchVtoPago': fechaVencimientoPago,
        'ImpTotal': importeGravado + importeIva + importeExentoIva,
        'ImpTotConc': 0, // Importe neto no gravado
        'ImpNeto': importeGravado,
        'ImpOpEx': importeExentoIva,
        'ImpIVA': importeIva,
        'ImpTrib': 0, //Importe total de tributos
        'MonId': 'PES', //Tipo de moneda usada en la factura ('PES' = pesos argentinos) 
        'MonCotiz': 1, // Cotización de la moneda usada (1 para pesos argentinos)  
        'Iva': [ // Alícuotas asociadas a la factura
            {
                'Id': 5, // Id del tipo de IVA (5 = 21%)
                'BaseImp': importeGravado,
                'Importe': importeIva
            }
        ]
    };

    useEffect(() => {
        const fetchLastVoucher = async () => {
            try {
                const lastVoucher = await afip.ElectronicBilling.getLastVoucher(puntoDeVenta, tipoDeComprobante);
                setLastVoucher(lastVoucher);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error('An unknown error occurred'));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLastVoucher();
    }, []); // El array vacío asegura que useEffect se ejecute solo una vez, al montar el componente

    const facturar = async () => {
        /** 
        * Creamos la Factura 
        **/
        const res = await afip.ElectronicBilling.createVoucher(data);
        //Generamos el PDF
        generarPDF();
        /**
         * Mostramos por pantalla los datos de la nueva Factura 
         **/
        console.log({
            'cae': res.CAE, //CAE asignado a la Factura
            'vencimiento': res.CAEFchVto //Fecha de vencimiento del CAE
        });
    }

    const generarPDF = async () => {
        // Descargamos el HTML de ejemplo (ver mas arriba)
        // y lo guardamos como bill.html
        //const html = require('fs').readFileSync('bill.html', 'utf8');
        const response = await fetch('bill.html');
        const html = await response.text();

        // Nombre para el archivo (sin .pdf)
        const name = 'PDF de prueba';

        // Opciones para el archivo
        const options = {
            width: 8, // Ancho de pagina en pulgadas. Usar 3.1 para ticket
            marginLeft: 0.4, // Margen izquierdo en pulgadas. Usar 0.1 para ticket 
            marginRight: 0.4, // Margen derecho en pulgadas. Usar 0.1 para ticket 
            marginTop: 0.4, // Margen superior en pulgadas. Usar 0.1 para ticket 
            marginBottom: 0.4 // Margen inferior en pulgadas. Usar 0.1 para ticket 
        };

        // Creamos el PDF
        const res = await afip.ElectronicBilling.createPDF({
            html: html,
            file_name: name,
            options: options
        });

        setAux(res.file)

        // Mostramos la url del archivo creado
        console.log(res.file);
    }

    return (
        <>
            <h1>Página de prueba</h1>
            <p>Punto de venta: 1</p>
            <p>Tipo de comprobante: 1</p>
            {loading && <p>Cargando...</p>}
            {error && <p>Error al obtener el último comprobante: {error.message}</p>}
            {lastVoucher !== null && <p>Último comprobante: {lastVoucher}</p>}
            <Button onClick={facturar}>Facturar</Button>

            <p>{aux}</p>
        </>
    );
};

export default Pruebas;
