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
                MusicShop tiene dos sucursales en Mendoza. Te invitamos a visitarnos en cualquiera de nuestras tiendas para encontrar una amplia gama de instrumentos musicales y accesorios para todos los niveles.
            </p>
            
            {/* Tarjetas con la misma altura */}
            <div className="row mb-4">
                <div className="col-md-6 d-flex align-items-stretch">
                    <div className="card equal-card">
                        <div className="card-body">
                            <h4 className="card-title">Sucursal Central</h4>
                            <p className="card-text">
                                Dirección: Avenida San Martín 1000. Centro. Mendoza.
                            </p>
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.448239960358!2d-68.84085262461177!3d-32.88631516884348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed2dd83f7%3A0xf41c7ab7e3522157!2sAv.%20San%20Mart%C3%ADn%20%26%20Av.%20Las%20Heras%2C%20Capital%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1713369845039!5m2!1ses!2sar"
                                    width="100%"
                                    height="250"
                                    style={{ border: '0' }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className='map-iframe'
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 d-flex align-items-stretch">
                    <div className="card equal-card">
                        <div className="card-body">
                            <h4 className="card-title">Sucursal Los Corralitos</h4>
                            <p className="card-text">
                                Dirección: Callejón Lemos 1300. Los Corralitos - Guaymallén. 
                            </p>
                            <div className="map-container">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.979098368881!2d-68.7967462!3d-32.9979574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967d0f7c0752f479%3A0x9d643cd2ea1468d1!2sCallej%C3%B3n%20Lemos%2C%20Guaymall%C3%A9n%2C%20Mendoza!5e0!3m2!1ses!2sar!4v1713369985234!5m2!1ses!2sar"
                                    width="100%"
                                    height="250"
                                    style={{ border: '0' }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className='map-iframe'
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-info text-center">
                <div className="contact-bg"> 
                    <p className="contact-text"><strong>Teléfono:</strong> (123) 456-7890</p>
                    <p className="contact-text"><strong>Email:</strong> musicShop@gmail.com</p>
                    <a href="/contacto" className="btn-contacto">Contáctanos</a>
                </div>
            </div>
        </div>
    );
};

export default DondeEstamos;
