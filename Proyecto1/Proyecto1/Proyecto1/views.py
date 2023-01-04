from django.http import HttpResponse
from tkinter import TK, Button,Label,PhotoImage
from PIL import Image
import datetime
from django.template import Template, Context
import os


def saludo(request): #primera vista
     doc_externo=open(os.path.dirname(os.path.realpath(__file__))+ "/Plantillas/Myplantilla.html")
     plt=Template(doc_externo.read())
     doc_externo.close()
     ctx=Context()
     documento=plt.render(ctx)
     return HttpResponse(documento)
    
def archivo(requtes):
        return render(request,"Archivo.html")
    
def despida(requtes):
        return HttpResponse("Hasta luego")


#---------------------------------------- botones ----------

def saludo1():
     tkinter.Label(ventana,text="Hola Mundo").pack

def salir():
     ventana.destroy()


root=tk()
root.minsize(height=100, width=100)

def tab4():
  
  def tab5():
       label4.destroy()
       button4.destroy()
       label5=Label(root,text='esto es Second',font=('Times_new_Roman',25))
       label5.pack()

        def back():
            label5.destroy()
            button5.destroy()
            tab1()

        button5=Button(root,text='Back',font=('Times_new_Roman',25),command=back)
        button5.pack(side=BOTTOM)

  label4=Label(root,text='esto es primera',font=('Times_new_Roman',25))
  label4.pack()
  button4=Button(root,text='Next',font=('Times_new_Roman',25),command=tab5)
  button4.pack(side=BOTTOM)

tab4()
root.mainloop()

def guarda():

    archivo = open("prueba.txt","a")
    archivo.write("Hola Mundo\n")
    archivo.write("La vida triste\n")
    nombre = input("Introduce tu nombre ")
    archivo.write(nombre+ '\n')
    numero = int(input("Introduce tu numero "))
    archivo.write('numero=% s'%numero+'\n')
    n=int(input("¿Cuantos deportes?"))
    deportes=[]

      for i in range(n)
         deporte=input("Deporte: ")
         deportes.append(deporte)

    archivo.write('deportes=%s'%deportes)
    archivo.close()


boton = tkinter.button(ventana,text="invoca un Saludo", command = saludo, fg="red")
boton.pack()
boton.place(x=100,y=200,height = 75, width =150)

boton2 =tkinter.button(ventana,text="Salir", command = salir, fg="green")
boton2.pack()
boton.place(x=180,y=400,height = 75, width =150)


boton3= tkinter.button(ventana,text="guarda", command = guarda, fg="green")
boton3.pack()
boton.place(x=180,y=400,height = 75, width =150)


        
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

                if coincidencias == 0
                      print("No hubo coincidencias.")
                 else 
                      print(f"Coincidencias encontradas:{coincidencias}.")
        pass

 except OSError  as e:

        print(f"Error al acceder el archivo:{e}")

 except Exception  as e:

        print(f"Ocurrio un error:{e}")





































