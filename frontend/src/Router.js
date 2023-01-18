import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route,  Routes } from "react-router-dom";
import CrearEtiquetas from "./CrearEtiquetas";
import App from "./App";

function Routers() {
    return (
        <div className="fullwindow">
            <Router>
                <Routes>
                    <Route index element={<CrearEtiquetas/>} />
                    <Route path="/App/*" element={<App/>} />
                </Routes>
            </Router>
    </div>
    );
}

export default Routers;
