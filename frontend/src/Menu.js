import React, { useState } from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';


export default function App() {

  return (
    <div className="App-header">
      <button className="button-64" onClick={handleOnAdd}>Agregar</button>
      <button className="button-64" onClick={exportData}>Continuar</button>
    </div>
  );
}
