import { useUser } from "../../context/UserContext";
import * as sha1 from "js-sha1";
import Usuario from "../../entities/Usuario";
import UsuarioService from "../../services/UsuarioService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import './Login.css'; 

const Login = () => {
  const navigate = useNavigate();
  const { setUsuarioL } = useUser();
  const [txtValidacion, setTxtValidacion] = useState<string>("");
  const usuarioService = new UsuarioService();

  const [usuario, setUsuarioLocal] = useState<Usuario>({
    id: 0, 
    nombre: '',
    clave: '',
    nombreRol: '', // Incluye cualquier otro campo que requiera tu modelo
  });

  const [mostrarClave, setMostrarClave] = useState(false); // Estado para mostrar/ocultar la clave
  const [claveEscrita, setClaveEscrita] = useState(false); // Estado para saber si se está escribiendo la clave

  const url = import.meta.env.VITE_API_URL;

  const login = async () => {
    try {
      if (!usuario.nombre || !usuario.clave) {
        setTxtValidacion("Ingrese nombre de usuario y clave");
        return;
      }
  
      const users = await usuarioService.getAll(url + "usuario");
      const foundUser = users.find((u) => u.nombre.toLowerCase() === usuario.nombre.toLowerCase());
  
      console.log("Usuario encontrado:", foundUser); // Debug para verificar el usuario encontrado
      console.log("Clave ingresada:", sha1.sha1(usuario.clave));
  
      if (foundUser && sha1.sha1(usuario.clave) === foundUser.clave) {
        setUsuarioL(foundUser);
        console.log("Usuario logueado:", foundUser); // Debug para verificar que setUsuarioL se ejecute correctamente
        navigate("/", { replace: true });
      } else {
        setTxtValidacion("Usuario o clave incorrectos");
      }
    } catch (error) {
      console.error("Error en el login", error);
    }
  };
  
  const handleRegister = () => {
    navigate("/formularioUsuario/0");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              id="txtUsuario"
              className="form-control"
              placeholder="Nombre de usuario"
              value={usuario.nombre} // Cambiado a value
              onChange={(e) => setUsuarioLocal({ ...usuario, nombre: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") login();
              }}
            />
          </div>
          <div className="input-group" style={{ position: 'relative' }}>
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              type={mostrarClave ? "text" : "password"}
              id="txtClave"
              className="form-control"
              placeholder="Clave"
              value={usuario.clave} // Cambiado a value
              onChange={(e) => {
                const clave = e.target.value;
                setUsuarioLocal({ ...usuario, clave: clave });
                setClaveEscrita(clave.length > 0); // Actualiza el estado al escribir
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") login();
              }}
            />
            {claveEscrita && ( // Mostrar icono de ojo solo si se ha escrito algo
              <span className="eye-icon" onClick={() => setMostrarClave(!mostrarClave)} style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                {mostrarClave ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </div>
          <div className="d-grid">
            <button onClick={login} className="btn btn-Ingresar" type="button">
              Ingresar
            </button>
          </div>
          <div className="mt-3">
            <p className="validation-message">{txtValidacion}</p>
          </div>
          <div className="d-grid">
            <button onClick={handleRegister} className="btn btn-crearU" type="button">
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
