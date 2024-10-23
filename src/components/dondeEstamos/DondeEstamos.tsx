import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import './DondeEstamos.css';

const DondeEstamos = () => {
    return (
        <div className='container mt-5'>
            <div className='col-md-12 d-flex align-items-center mb-4'>
                <FontAwesomeIcon icon={faGlobe} className="icon-globe" />
                <h2 className='title ms-2'>¿Dónde estamos?</h2>
            </div>
            <p className="description">
                Visítanos en nuestra tienda musical ubicada en el corazón de Mendoza. 
                Ofrecemos una amplia gama de instrumentos musicales y accesorios para todos los niveles.
            </p>
            <div className="col-md-12 d-flex justify-content-center map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.448239960358!2d-68.84085262461177!3d-32.88631516884348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522157!2sAv.%20San%20Mart%C3%ADn%20%26%20Av.%20Las%20Heras%2C%20Capital%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1713369845039!5m2!1ses!2sar"
                    width="100%"
                    height="450"
                    style={{ border: '0' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className='map-iframe'
                ></iframe>
            </div>
            <div className="contact-info text-center">
                <div className="contact-bg"> {/* Contenedor para el fondo de contacto */}
                    <p className="contact-text"><strong>Teléfono:</strong> (123) 456-7890</p>
                    <p className="contact-text"><strong>Email:</strong> musicShop@gmail.com</p>
                    <a href="/contacto" className="btn btn-custom">Contáctanos</a>
                </div>
            </div>
        </div>
    );
};

export default DondeEstamos;
