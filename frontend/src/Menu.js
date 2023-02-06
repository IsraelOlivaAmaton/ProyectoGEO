import React, { useState } from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="area">
      <button className="button-64" onClick={()=> navigate('/Etiquetas')}>Crear nueva sesión</button>
      <button className="button-64" onClick={()=> navigate('/CargarSesion')}>Abrir sesión existente</button>
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      
    </div>
  );
}
