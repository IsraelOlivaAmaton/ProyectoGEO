from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def guardarCSV(request):
    nJson = json.loads(request.body.decode('utf-8',errors='replace').replace('\uFFFD', '?'))

    counter=0
    for line in nJson:
        if counter==0:
            #archivo = open("index.csv","a+")
            #archivo.write("")
            archivo = open(line['filename'].replace(".csv","") + "_saved.csv","w+")
            archivo.write("text,valor\n")
        else:
            archivo.write(str(line['text'].encode('utf-8').decode('utf-8'))+","+ str(line['value'])+"\n")
        counter+=1
    archivo.close()

    return HttpResponse(nJson)

def recuperarAnterior(request):
    nJson = json.loads(request.body.decode('utf-8',errors='replace').replace('\uFFFD', '?'))
    archivo = open("index.csv","r+")

    print("caca de mono")
