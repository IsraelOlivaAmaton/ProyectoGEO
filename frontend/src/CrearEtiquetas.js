import React, { useState } from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';
const defaultState = {
  etiqueta: "",
};

function Row({ onChange, onRemove, etiqueta}) {
  return (
    <div>
      <input
        value={etiqueta}
        onChange={e => onChange("etiqueta", e.target.value)}
        placeholder="Etiqueta"
      />

      <button className="button-eliminar" onClick={onRemove}>Eliminar etiqueta</button>
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState([defaultState]);
  const navigate = useNavigate();
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
    navigate('/App',
    {
        state: {
            data: rows
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
      {rows.map((row, index) => (
        <Row
          {...row}
          onChange={(name, value) => handleOnChange(index, name, value)}
          onRemove={() => handleOnRemove(index)}
          key={index}
        />
      ))}
      <button className="button-64" onClick={handleOnAdd}>Agregar</button>
      <button className="button-64" onClick={exportData}>Continuar</button>
    </div>
  );
}
