import React, { useState } from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const defaultState = {
  etiqueta: "",
};

function Row({ onChange, onRemove, etiqueta}) {
  return (
    <div>
      <input style={{fontSize: 20}}
        value={etiqueta}
        onChange={e => onChange("etiqueta", e.target.value)}
        placeholder="Etiqueta"
      />

      <button className="button-eliminar" style={{fontSize: 20}} onClick={onRemove}>Eliminar etiqueta</button>
    </div>
  );
}

export default function CrearEtiquetas() {
  const [rows, setRows] = useState([defaultState]);
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleOnChange = (index, name, value) => {
    const copyRows = [...rows];
    copyRows[index] = {
      ...copyRows[index],
      [name]: value
    };
    setRows(copyRows);
  };

  const handleOnAdd = () => {
    setRows(rows.concat(defaultState));
    console.log(rows)
  };

  const exportData =()=>{
    console.log(state)
    navigate('/App',
    {
        state: {
            data: rows,
            document: state.document
        }
    });
  }

  const handleOnRemove = index => {
    const copyRows = [...rows];
    copyRows.splice(index, 1);
    setRows(copyRows);
  };

  return (
    <div className="App-header">
      <div style={{position:'relative', top: -300}}>
        {rows.map((row, index) => (
          <Row
            {...row}
            onChange={(name, value) => handleOnChange(index, name, value)}
            onRemove={() => handleOnRemove(index)}
            key={index}
          />
        ))}
      </div>

      <button className="button-64" style={{top: '70%'}} onClick={handleOnAdd}>Agregar</button>
      <button className="button-64" style={{top: '85%'}} onClick={exportData}>Continuar</button>
    </div>
  );
}
