import React from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button, Col, Row } from 'react-bootstrap';
import Domicilio from '../../entities/Domicilio';

// Define los tipos de las props
interface FormularioDomicilioProps {
    domicilio: Domicilio;
    onRemove: () => void;
    onChange: (updatedDomicilio: Domicilio) => void;
}

const FormularioDomicilio: React.FC<FormularioDomicilioProps> = ({ domicilio, onRemove, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({ ...domicilio, [name]: value });
    };

    return (
        <Form className='formulario-contenedor'>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <FormLabel>Calle</FormLabel>
                        <FormControl
                            type="text"
                            name="calle"
                            placeholder="Ingrese la calle"
                            value={domicilio.calle || ''}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <FormLabel>Número</FormLabel>
                        <FormControl
                            type="text"
                            name="numero"
                            placeholder="Ingrese el número"
                            value={domicilio.numero || ''}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <FormLabel>Departamento</FormLabel>
                        <FormControl
                            type="text"
                            name="departamento"
                            placeholder="Ingrese el departamento"
                            value={domicilio.departamento || ''}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <FormLabel>Piso</FormLabel>
                        <FormControl
                            type="text"
                            name="piso"
                            placeholder="Ingrese el piso"
                            value={domicilio.piso || ''}
                            onChange={handleInputChange}
                        />
                    </FormGroup>
                </Col>
                {/* Agrega más campos según las propiedades de Domicilio */}
            </Row>
            <Button variant="danger" onClick={onRemove}>
                Eliminar Domicilio
            </Button>
        </Form>
    );
};

export default FormularioDomicilio;
