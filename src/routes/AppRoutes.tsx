import { Route, Routes } from "react-router-dom"
import Login from "../components/Login/Login"
import { Suspense, lazy } from "react"
import { RutaPrivada } from "../components/ControlAcceso/RutaPrivada"
import Home from "../components/home/Home"
import RolUsuario from "../components/ControlAcceso/RolUsuario"
import { Roles } from "../entities/Roles"
import Pruebas from "../components/Pruebas/Pruebas"
import LoaderPage from "../components/LoaderPage/LoaderPage"

const AppRoutes = () => {

  const DondeEstamos = lazy(() => import('../components/dondeEstamos/DondeEstamos'));
  const Instrumentos = lazy(() => import('../components/instrumentos/Instrumentos'));
  const DetalleInstrumentos = lazy(() => import('../components/detalleInstrumentos/DetalleInstrumentos'));

  return (
    <Suspense fallback={<LoaderPage></LoaderPage>}>
      <Routes>
        <Route path="/pruebas" element={<Pruebas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={
          <RutaPrivada>
            <Instrumentos />
          </RutaPrivada>
        } />
        <Route path="/products/detalle/:id" element={<DetalleInstrumentos />} />
        <Route path="/DondeEstamos" element={<DondeEstamos />} />
        
        <Route element={<RolUsuario rol={Roles.ADMIN} />}>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes