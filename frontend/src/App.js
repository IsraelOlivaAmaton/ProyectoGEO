import React, { useState, useEffect} from "react";
import './App.css';
import Swal from 'sweetalert2'
import Papa from "papaparse";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import download from 'downloadjs';
import { useNavigate } from 'react-router-dom';


function App() {
  const edicion = true;
  const [data, setData] = useState();
  const [linea, setLinea]=useState("");
  const [valor, setValor] = useState([]);
  const [index, setIndex] = useState(0);
  const [buttons, setButtons] = useState([]);
  const [readyToDownload, setReadytoDownload] = useState(false);
  const [externalUrl, setExternalUrl] = useState();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [textoBoton, setTextoBoton] = useState("Generar documento")
  useEffect(()=>{
    loadState();
  }, [setData]);

  const loadState = () =>{
    handleParse(state.document, state.response?.lastIndex);
    if(state.response){

      const tempArray = []
      for(var propName in state.response.fields) {
        if(state.response.fields.hasOwnProperty(propName)) {
            var propValue = state.response.fields[propName];
            tempArray.push(Object.values(propValue)[0])
        }
      }
      setButtons(tempArray);
      //setIndex(state.response.lastIndex)

    }else{ 
      const tempArray = ["Pos", "Neu", "Neg"]
      state.data.map((e,idx)=>{
        tempArray.push(e.etiqueta);
      });
      
      setButtons(tempArray);
    }
  }

  const handleParse = (doc, lidx) => {
      const reader = new FileReader();
      reader.onload = async ({ target }) => {
          const csv = Papa.parse(target.result, { header: true });
          const rawData = csv?.data;
          setData(rawData);
          
          console.log("valor?", rawData[0]['etiqueta']);
          let contador = 0
          if(rawData[0]['etiqueta']){
            
            const tempArray = []
            rawData.map((e, idx)=>{
              tempArray.push(e.etiqueta === ''?undefined:e.etiqueta);
              console.log(idx, " ", e.etiqueta)
              if(e.etiqueta !== '' && e.etiqueta !== undefined){
                contador = idx
              }
            })
            setLinea(rawData[contador]['text']);
            console.log("tempArr? ", tempArray)
            setValor(tempArray)
            setIndex(contador+1)
          }else{
            setLinea(rawData[contador]['text']);
          }
      };
      reader.readAsText(doc, "utf-8");
  };

  const atras=()=>{
    if(index > 0){
      try{
        setIndex(index => index - 1)
      }catch{
        
      }
      
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
    arr[index] = buttons[idx];
    setValor(arr)
    adelante();
  }

  const guardarCSV=()=>{
    var jsons = new Array();

    var count = 0;
    data.forEach((e,idx)=>{
      count+=1
    })
    jsons.push({'filename':state.document.name,'lastIdx':index,'length':count})
    buttons.map((e,idx)=>{
      jsons.push({columnName:e})
    })
    data.forEach((elemento,idx) => {
      jsons.push({'text': typeof elemento['text'] === 'undefined'?'': elemento['text'],'value': typeof valor[idx] === 'undefined'?'':valor[idx],'tag':typeof valor[idx] === 'undefined'?'': valor[idx]});
    });

    axios.post('http://127.0.0.1:8000/generarCSV',jsons,{
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFTOKEN',

    }).then(async function (response) {
      //const content = response.headers['content-type'];
      //const down = download(response.data, state.document.name, content);
      setExternalUrl(response.data);
      console.log(response.data);
      setReadytoDownload(true);
      /*Swal.fire({
        title: 'Guardado!',
        text: 'El archivo ' + state.document.name + " está listo para descargarse!",
        icon: 'success',
        confirmButtonText: 'Cool'
      }).then(
        //navigate('/')
      );*/
    });
  }

  return (
    <div className="App" >
      <header className="App-header">
        {edicion?<div>
          <div className="text-max-width">
            
            Línea: {index + " = " + linea + " - " }
            <p>{typeof valor[index] === 'undefined'?'':valor[index]}</p>
            
          </div>
          <div>
            <button onClick={atras}>◀️</button>
            <button onClick={adelante}>▶️</button>
          </div>
          {
            buttons?.map((e,idx)=>{

              return <div className='box-3' onClick={()=> clickButton(idx)}><div className="btn-three" key={idx} ><span>{e}</span></div></div>
            })
            
          }
          
        </div>:<></>}
        {
          readyToDownload?
          <div>
            <a download href={externalUrl} onclick="document.execCommand('SaveAs',true,'file.html');"> Haga clic derecho para descargar como</a>
            <div className="button-64" style={{top: 800}}onClick={()=>navigate('/')}>Salir</div>
          </div>
          :<p><div className='fifth' style={{width: '100%'}} onClick={guardarCSV}>{textoBoton}</div></p>
        }
      </header>
    </div>
  );
}

export default App;
