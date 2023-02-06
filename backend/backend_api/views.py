from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import csv

@csrf_exempt
def guardarCSV(request):
    nJson = json.loads(request.body.decode('utf-8',errors='replace').replace('\uFFFD', '?'))
    length = len(nJson) - nJson[0]['length']
    filename = nJson[0]['filename'].replace(".csv","")
    counter=0
    jsonfile = ''
    actualid=0
    try:
        file = open("index.json","r+")
        cadena = file.read()
        jsonfile = json.loads(cadena)	
        file.close()
    except json.decoder.JSONDecodeError:
        file = open("index.json","w+") 
        file.write('{"documents": []}')
        cadena = file.read()
        jsonfile = json.loads(cadena)
        file.close()	
    
    for line in nJson:
        if counter<length:
            if counter == 0:
                archivo = open( filename + "_saved.csv","w+")
                archivo.write("text,valor\n")
                for idx, obj in enumerate(jsonfile.get('documents')):		
                    if obj['filename'] == line['filename']:
                        actualid = idx
                        print(actualid)
                        jsonfile['documents'].pop(idx)
                jsonfile['documents'].append({'filename':line['filename'],'lastIndex':line['lastIdx'],'fields':[]})

                print(jsonfile)
            else:
                jsonarchivo = open("index.json","w+")
                print(line['columnName'])
                jsonfile['documents'][actualid]['fields'].append({'field'+str(counter):line['columnName']})
                json.dump(jsonfile, jsonarchivo, indent=4)
                jsonarchivo.close()
        else:
            archivo.write(str(line['text'].encode('utf-8').decode('utf-8'))+","+ str(line['value'])+"\n")
        counter+=1
    archivo.close()

    return HttpResponse(nJson)

@csrf_exempt
def recuperarSesion(request):
    nJson = json.loads(request.body.decode('utf-8',errors='replace').replace('\uFFFD', '?'))
    name = nJson['filename']
    archivo = open("index.json","r+")
    cadena = archivo.read()
    jsonfile = json.loads(cadena)
    for idx, obj in enumerate(jsonfile.get('documents')):		
        if obj['filename'] == name:
            print(obj)
            return HttpResponse(json.dumps(obj))
    return HttpResponse(0)

@csrf_exempt
def cargarAntiguo(request):
    nJson = json.loads(request.body.decode('utf-8',errors='replace').replace('\uFFFD', '?'))
    name = nJson['filename']
    file=open(name.replace(".csv","")+"_saved.csv")
    csvReader = csv.DictReader(file)
    jsonArray = []

    for row in csvReader: 
        jsonArray.append(row) 
    jsonString = json.dumps(jsonArray, indent=4)
    return HttpResponse(jsonString)

