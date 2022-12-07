import json
from urllib import request
from django.http import HttpResponse
from tkinter import Tk, Button,Label,PhotoImage
from PIL import Image
import datetime
from django.shortcuts import render
from django.template import Template, Context
import os
import cgi


def saludo(request): #primera vista; Index
     return render(request, (os.path.dirname(os.path.realpath(__file__))+ "/Plantillas/index.html"))
    
def archivo(requtes):
     return render(requtes,"Archivo.html")
    
def despida(requtes):
     return HttpResponse("Hasta luego")


#---------------------------------------- botones ----------


          


        
#----------- Archivos -----------------

def guardarTXT(request):
     data = request.POST.get('contenido')
     archivo = open("prueba.txt","w+")
     archivo.write("Hola Mundo\n")
     archivo.write("La vida triste\n")
     archivo.write(data)
     archivo.close()
     
     return HttpResponse(data)


def busquedatexto(request):
     try:
          coincidencias = 0
          data = request.POST.get('busqueda')
          with open("prueba.txt","r+")as archivo:
               for i,linea in enumerate(archivo):
                    print(f"Linea{i+1}:{linea}", end="")
                    if data in linea:
                         coincidencias +=1
               if coincidencias == 0:
                    return HttpResponse("No hubo coincidencias.")
               else: 
                    return HttpResponse(f"Coincidencias encontradas: {coincidencias}")

     except OSError  as e:

          print(f"Error al acceder el archivo:{e}")
     except Exception  as e:

          print(f"Ocurrio un error:{e}")





































