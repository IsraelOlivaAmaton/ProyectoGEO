from django.http import HttpResponse
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






































