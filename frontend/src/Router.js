import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route,  Routes } from "react-router-dom";
import CrearEtiquetas from "./CrearEtiquetas";
import App from "./App";
import Menu from './Menu';
import CargarSesion from './CargarSesion';
function Routers() {
    return (
        <div className="fullwindow">
            <Router>
                <Routes>
                    <Route index element={<Menu/>} />
                    <Route path="/App/*" element={<App/>}/>
                    <Route path="/Etiquetas/*" element={<CrearEtiquetas/>}/>
                    <Route path="/CargarSesion/*" element={<CargarSesion/>}/>
                </Routes>
            </Router>
    </div>
    );
}

export default Routers;
