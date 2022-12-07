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

def guardarTXT(request):
     data = request.POST.get('contenido')
     archivo = open("prueba.txt","w+")
     archivo.write("Hola Mundo\n")
     archivo.write("La vida triste\n")
     archivo.write(data)
     archivo.close()
     
     return HttpResponse(data)

          


        
#----------- Archivos -----------------

def Archiotxt(requtes):
          with open("saludo.txt")as file_object:
                leer = file_object.readlines()
                print(leer)



def busquedatexto():
     print("Busqueda en un archivo de texto")
     nombreArchivo = input("Escriba el nombre del archivo")
     coincidencias = 0
     try:
          with open(nombreArchivo,"r")as archivo:
               busqueda = input("Texto a buscar:")
               print("\nResultado:")

               for i,linea in enumerate(archivo):
                    print(f"Linea{i+1}:{linea}", end="")
                    coincidencias +=1

                    if coincidencias == 0:
                         print("No hubo coincidencias.")
                    else: 
                         print(f"Coincidencias encontradas:{coincidencias}.")
               pass

     except OSError  as e:

          print(f"Error al acceder el archivo:{e}")
     except Exception  as e:

          print(f"Ocurrio un error:{e}")





































