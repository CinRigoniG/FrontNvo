import { Route, Routes } from "react-router-dom"
import Login from "../components/Login/Login"
import { Suspense, lazy } from "react"
import { RutaPrivada } from "../components/ControlAcceso/RutaPrivada"
import Home from "../components/PaginaPrincipal/PaginaPrincipal"
import RolUsuario from "../components/ControlAcceso/RolUsuario"
import { Roles } from "../entities/Roles"
import LoaderPage from "../components/LoaderPage/LoaderPage"
import GrillaInstrumentos from "../components/GrillaInstrumentos/GrillaInstrumentos"
import GrillaPedidos from "../components/GrillaPedidos/GrillaPedidos"
import GrillaUsuario from "../components/GrillaUsuarios/GrillaUsuarios"

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
        <Route path="/DondeEstamos" element={<DondeEstamos />} />
        {/* Rutas disponibles solo si el usuario es ADMIN */}
        <Route element={<RolUsuario rol={Roles.ADMIN} />}>
          <Route path="/grillaInstrumentos" element={<GrillaInstrumentos />}/>
          <Route path="/grillaPedidos" element={<GrillaPedidos />}/>
          <Route path="/grillaUsuarios" element={<GrillaUsuario />}/>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes