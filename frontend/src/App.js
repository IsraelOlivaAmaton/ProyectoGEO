import logo from './logo.svg';
import React, { useState, useEffect} from "react";
import './App.css';
import Swal from 'sweetalert2'
import Papa from "papaparse";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
function App() {
  const [file, setFile] = useState("");
  const [edicion,setEdicion] =useState(false);
  const [data, setData] = useState();
  const [linea, setLinea]=useState("");
  const allowedExtensions = ["csv"];
  const [valor, setValor] = useState([]);
  const [index, setIndex] = useState(0);
  const { state } = useLocation();

  //funcion para abrir archivo CSV
  const handleFileChange = (e) => {
    if (e.target.files.length) {
        const inputFile = e.target.files[0];
        const fileExtension = inputFile?.type.split("/")[1];
        if (!allowedExtensions.includes(fileExtension)) {
          Swal.fire({
            title: 'Error!',
            text: 'No es un archivo CSV',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
        }else
          setFile(inputFile);
    }
};
    const handleParse = () => {
         
        if (!file)           
          Swal.fire({
          title: 'Error!',
          text: 'No es un archivo CSV válido',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
 
        const reader = new FileReader();

        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, { header: true });
            const rawData = csv?.data;
            setData(rawData);
            setLinea(rawData[0]['text'])
        };
        reader.readAsText(file);
        setEdicion(true);
    };
    const atras=()=>{
      if(index > 0){
        setIndex(index => index - 1)
        setLinea(data[index-1]['text'])
      }
    }
    const adelante=()=>{
      if(index < data.length){
        setIndex(index => index + 1)
        setLinea(data[index+1]['text'])
      }
    }

    const clickButton =(idx)=>{
      let arr = [...valor];
      arr[index] = idx;
      setValor(arr)
      console.log("index: ", index, " : valarray ",arr[index], " : in dataval", state.data[valor[index]])
      adelante();
    }
    const guardarCSV=()=>{
      var jsons = new Array();
      jsons.push({'filename':file.name,'lastIdx':index[index.length-1]})
      data.forEach((elemento,idx) => {
    
        jsons.push({'text':elemento['text'],'value': typeof valor[idx] === 'undefined'?'':valor[idx]});

      });
      const myObjStr = JSON.stringify(jsons);
      axios.post('http://127.0.0.1:8000/generarCSV',jsons,{
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
        },
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFTOKEN',

      }).then(function (response) {
        Swal.fire({
          title: 'Guardado!',
          text: 'El archivo se ha guardado como: ' + file.name.replace(".csv","") + "_saved.csv",
          icon: 'success',
          confirmButtonText: 'Cool'
        })
      });
    }

  return (
    <div className="App" >
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Abrir 
        </p>        <input
                onChange={handleFileChange}
                id="csvInput"
                name="file"
                type="File"
            />
        <p>
        un archivo CSV
        </p>
        <div>
                <button onClick={handleParse}>Comenzar a clasificar</button>
        </div>
        {edicion?<div>
          <div>
            <button onClick={atras}>◀️</button>
            Línea: {index + " = " + linea + " - " }
            <p>{typeof valor[index] === 'undefined'?'':state.data[valor[index]].etiqueta}</p>
            <button onClick={adelante}>▶️</button>
          </div>{
            state.data.map((e,idx)=>{
              return <div className='box-3' onClick={()=> clickButton(idx)}><div className="btn-three" key={idx} ><span>{e.etiqueta}</span></div></div>
            })
            
          }
          <p><div className='fifth' onClick={guardarCSV}>Finalizar</div></p>
        </div>:<></>}
      </header>
    </div>
  );
}

export default App;
