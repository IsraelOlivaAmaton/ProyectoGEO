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
  const { state } = useLocation();
  const navigate = useNavigate();

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
      setIndex(state.response.lastIndex)

    }else{ 
      const tempArray = [];
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
          setLinea(rawData[lidx?lidx:0]['text']);
          if(rawData[0]['valor']){
            const tempArray = []
            rawData.map((e)=>{
              tempArray.push(e.valor === ''?undefined:e.valor)
            })
            console.log(tempArray)
            setValor(tempArray)
          }
      };
      reader.readAsText(doc);
  };

  const atras=()=>{
    if(index > 0){
      try{
        setIndex(index => index - 1)
      }catch{
        alert("error cachondote")
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
    jsons.push({'filename':state.document.name,'lastIdx':index,'length':count})
    buttons.map((e,idx)=>{
      jsons.push({columnName:e})
    })
    data.forEach((elemento,idx) => {
      jsons.push({'text': typeof elemento['text'] === 'undefined'?'': elemento['text'],'value': typeof valor[idx] === 'undefined'?'':valor[idx],'tag':typeof valor[idx] === 'undefined'?'': buttons[valor[idx]]});
    });

    axios.post('http://127.0.0.1:8000/generarCSV',jsons,{
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFTOKEN',
      responseType: 'blob'

    }).then(function (response) {
      const content = response.headers['content-type'];
      download(response.data, state.document.name, content);
      Swal.fire({
        title: 'Guardado!',
        text: 'El archivo ' + state.document.name + " se ha modificado!",
        icon: 'success',
        confirmButtonText: 'Cool'
      }).then(
        navigate('/')
      );
    });
  }

  return (
    <div className="App" >
      <header className="App-header">
        {edicion?<div>
          <div>
            <button onClick={atras}>◀️</button>
            Línea: {index + " = " + linea + " - " }
            <p>{typeof valor[index] === 'undefined'?'':buttons[valor[index]]}</p>
            <button onClick={adelante}>▶️</button>
          </div>{
            buttons?.map((e,idx)=>{

              return <div className='box-3' onClick={()=> clickButton(idx)}><div className="btn-three" key={idx} ><span>{e}</span></div></div>
            })
            
          }
          <p><div className='fifth' onClick={guardarCSV}>Finalizar</div></p>
        </div>:<></>}
      </header>
    </div>
  );
}

export default App;
