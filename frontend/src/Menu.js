import React from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "axios";

export default function Menu() {
  const navigate = useNavigate();
  const allowedExtensions = ["csv"];

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
          const packet = new Array();
          packet.push({'filename':inputFile.name})
          axios.post('http://127.0.0.1:8000/recuperarSesion',packet[0],{
            headers: {
              'Accept':'application/json',
              'Content-Type':'application/json',
            },
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFTOKEN',
            }).then(function (response) {
              console.log(response);
              if(response.data === 0){
                navigate('/Etiquetas', {state: {document: inputFile}});
              }else{
                  Swal.fire({
                    title: 'Sesión existente!',
                    text: 'El archivo se ha cargado como: ' + inputFile.name,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }).then(()=>{
                    navigate('/App',{state: {document: inputFile, response: response.data}});
                  })
              }
          });
        }
          
    }
  };
  return (
    <div className="area">
      <div style={{fontSize:'30px', textAlign: 'center', position: 'absolute', top: '30%', left: '50%', marginLeft:'-150px', zIndex: 2}}>
        <p>
          Abrir 
        </p>        
        <input
                onChange={handleFileChange}
                id="csvInput"
                name="file"
                type="File"
        />
        <p>
        un archivo CSV
        </p>
      </div>
      <button className="button-64" onClick={()=> navigate('/Etiquetas')}>Comenzar</button>
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