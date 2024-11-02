import { Route, Routes } from "react-router-dom"
import Login from "../components/Login/Login"
import { Suspense, lazy } from "react"
import { RutaPrivada } from "../components/ControlAcceso/RutaPrivada"
import Home from "../components/PaginaPrincipal/PaginaPrincipal"
import RolUsuario from "../components/ControlAcceso/RolUsuario"
import { Roles } from "../entities/Enums/Roles"
import LoaderPage from "../components/LoaderPage/LoaderPage"
import GrillaInstrumentos from "../components/Grillas/GrillaInstrumentos"
import GrillaPedidos from "../components/Grillas/GrillaPedidos"
import GrillaUsuario from "../components/Grillas/GrillaUsuarios"
import FormularioInstrumento from "../components/Formularios/FormularioInstrumento"
import FormularioPedido from "../components/Formularios/FormularioPedido"
import FormularioDetallPedido from "../components/Formularios/FormularioDetallePedido"
import GrillaDetallePedido from "../components/Grillas/GrillaDetallePedido"
import FormularioUsuario from "../components/Formularios/FormularioUsuario"
import FormularioPersona from "../components/Formularios/FormularioPersona"
import PantallaAdmin from "../components/PantallaAdmin/PantallaAdmin"

const AppRoutes = () => {

  const DondeEstamos = lazy(() => import('../components/DondeEstamos/DondeEstamos'));
  const Instrumentos = lazy(() => import('../components/Instrumentos/Instrumentos'));
  const DetalleInstrumentos = lazy(() => import('../components/DetalleInstrumentos/DetalleInstrumentos'));

  return (
    <Suspense fallback={<LoaderPage></LoaderPage>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        {/* Ruta que necesita estar logueado */}
        <Route path="/products" element={
          <RutaPrivada>
            <Instrumentos />
          </RutaPrivada>
        } />
        <Route path="/products/detalle/:id" element={<DetalleInstrumentos />} />
        <Route path="/dondeEstamos" element={<DondeEstamos />} />
        {/* Rutas disponibles solo si el usuario es ADMIN */}
        <Route element={<RolUsuario rol={Roles.ADMIN} />}>
        <Route path="/pantallaAdmin" element={<PantallaAdmin />}/>
          <Route path="/grillaInstrumentos" element={<GrillaInstrumentos />}/>
          <Route path="/formularioInstrumento/:idInstrumento" element={<FormularioInstrumento />}/>
          <Route path="/grillaPedidos" element={<GrillaPedidos />}/>
          <Route path="/formularioPedido/:idPedido" element={<FormularioPedido />}/>
          <Route path="/formularioDetallePedido/:idDetPedido" element={<FormularioDetallPedido />}/>
          <Route path="/detallePedido/:idPedido" element={<GrillaDetallePedido />}/>
          <Route path="/grillaUsuarios" element={<GrillaUsuario />}/>
          <Route path="/formularioUsuario/:idUsuario" element={<FormularioUsuario />}/>
          <Route path="/formularioPersona/:usuarioId" element={<FormularioPersona />}/>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes