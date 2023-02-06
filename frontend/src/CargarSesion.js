import logo from './logo.svg';
import React, { useState, useEffect} from "react";
import './App.css';
import Swal from 'sweetalert2'
import Papa from "papaparse";
import axios from 'axios';
import { json, useLocation } from 'react-router-dom';
function CargarSesion() {
  const [file, setFile] = useState("");
  const [edicion,setEdicion] =useState(false);
  const [data, setData] = useState();
  const [linea, setLinea]=useState("");
  const allowedExtensions = ["csv"];
  const [valor, setValor] = useState([]);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState();

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
        }else{
            setFile(inputFile);
            axios.post('http://127.0.0.1:8000/recuperarSesion',{'filename':inputFile.name},{
                headers: {
                  'Accept':'application/json',
                  'Content-Type':'application/json',
                },
                xsrfCookieName: 'csrftoken',
                xsrfHeaderName: 'X-CSRFTOKEN',
              }).then(function (response) {
                console.log(response)
                if(response.data == 0){
                    console.log("No")
                    Swal.fire({
                        title: 'No encontrado!',
                        text: 'No está registrado este documento como archivo ya procesado',
                        icon: 'question',
                        confirmButtonText: 'Entendido'
                      })
                }else{
                    var arrayButtons = new Array();
                    setIndex(response.data['lastIndex']);
                    response.data.fields.map((e,idx)=>{
                        for(var key in e)
                            arrayButtons.push(e[key])
                    })
                    console.log(arrayButtons);
                    setState(arrayButtons);
                    axios.post('http://127.0.0.1:8000/cargarAntiguo',{'filename':inputFile.name},{
                        headers: {
                            'Accept':'application/json',
                            'Content-Type':'application/json',
                          },
                          xsrfCookieName: 'csrftoken',
                          xsrfHeaderName: 'X-CSRFTOKEN',
                    }).then(function(response2){
                        var textArray = new Array();
                        var valueArray = [];

                        response2.data.forEach(element => {
                            textArray.push({'text':element['text']})
                            valueArray.push(element['valor'])
                        });
                        setData(textArray)
                        setValor(valueArray)
                    })

                    Swal.fire({
                      title: 'Sesión existente!',
                      text: 'El archivo se ha cargado como: ' + inputFile.name.replace(".csv","") + "_saved.csv",
                      icon: 'success',
                      confirmButtonText: 'Ok'
                    })
                }
            });
        }
          
    }
};
    const handleParse = () => {
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
      adelante();
    }
    const guardarCSV=()=>{
      var jsons = new Array();

      var count = 0;
      data.forEach((e,idx)=>{
        count+=1
      })
      jsons.push({'filename':file.name,'lastIdx':index,'length':count})
      console.log(count)
      state.map((e,idx)=>{
        const columnName = 'field_' + idx;
        jsons.push({columnName:e})
      })
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
                <button className="button-64" onClick={handleParse}>Comenzar a clasificar</button>
        </div>
        {edicion?<div>
          <div>
            <button onClick={atras}>◀️</button>
            Línea: {index + " = " + linea + " - " }
            <p>{typeof valor[index] === 'undefined'?'':state[valor[index]]}</p>
            <button onClick={adelante}>▶️</button>
          </div>{
            state.map((e,idx)=>{
              return <div className='box-3' onClick={()=> clickButton(idx)}><div className="btn-three" key={idx} ><span>{e}</span></div></div>
            })
            
          }
          <p><div className='fifth' onClick={guardarCSV}>Finalizar</div></p>
        </div>:<></>}
      </header>
    </div>
  );
}

export default CargarSesion;
