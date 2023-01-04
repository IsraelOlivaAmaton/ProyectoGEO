import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';
import Swal from 'sweetalert2'
import Papa from "papaparse";
import axios from "axios";
function App() {
  const [file, setFile] = useState("");
  const [edicion,setEdicion] =useState(false);
  const [data, setData] = useState();
  const [linea, setLinea]=useState("");
  const allowedExtensions = ["csv"];
  const [valor, setValor] = useState([]);
  const [index, setIndex] = useState(0)
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
 
        // Initialize a reader which allows user
        // to read any file or blob.
        const reader = new FileReader();
         
        // Event listener on reader when the file
        // loads, we parse it and set the data.
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
    const neg =()=>{
      let arr = [...valor];
      arr[index] = 0;
      setValor(arr)
      console.log("index: ", index, " : ",arr[index])
    }
    const neu =()=>{
      let arr = [...valor];
      arr[index] = 1;
      setValor(arr)
      console.log("index: ", index, " : ",arr[index])
    }
    const pos =()=>{
      let arr = [...valor];
      arr[index] = 2;
      setValor(arr)
      console.log("index: ", index, " : ",arr[index])
    }
    const guardarCSV=()=>{
      var jsons = new Array();
      data.forEach((elemento,idx) => {
        jsons.push({'text':elemento['text'],'valor': typeof valor[index] === 'undefined'?'':valor[idx]})
      });
      const myObjStr = JSON.stringify(jsons);
      axios('http://127.0.0.1:8000/guardarTXT',{
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
          'Content-Type': 'application/json',
        },
        data: myObjStr,
        withCredentials: true,
        credentials: 'same-origin',
      }).then(function (response) {
        console.log(response);
      });
    }

  return (
    <div className="App">
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
            <p>{typeof valor[index] === 'undefined'?'':valor[index]===0?'😥 Negativo':valor[index]===1?'😐 Neutral':'🙂 Positivo'}</p>
            <button onClick={adelante}>▶️</button>
          </div>
          <button onClick={neg}>😥 Negativo</button><button onClick={neu }>😐 Neutral</button><button  onClick={pos}>🙂 Positivo</button>
          <p><button onClick={guardarCSV}>Finalizar</button></p>
        </div>:<></>}
      </header>
    </div>
  );
}

export default App;
