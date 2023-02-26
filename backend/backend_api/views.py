from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import csv

@csrf_exempt
def guardarCSV(request):
    print(request.encoding)
    nJson = json.loads(request.body.decode('utf-8',errors='replace').replace('\uFFFD', '?').encode('utf-8'))
    length = len(nJson) - nJson[0]['length']
    print(nJson[0]['filename'], "  O  KKK")
    filename = nJson[0]['filename'].replace(".csv","")
    lastIndex = nJson[0]['lastIdx']
    counter=0
    jsonfile = ''
    actualid = 0
    nuevo = True
    first = True
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
                archivo = csv.writer(open( filename + ".csv","w+",newline='', encoding='utf-8')) 
                archivo.writerow(['text', 'valor', 'etiqueta'])
                for idx, obj in enumerate(jsonfile.get('documents')):		
                    if obj['filename'] == line['filename']:
                        actualid = idx
                        print(obj['filename'], " = ", line['filename'], " id? = ",actualid)
                        #jsonfile['documents'].pop(idx)
                        jsonfile['documents'][actualid]['lastIndex'] = line['lastIdx']
                        #.append({'filename':line['filename'],'lastIndex':line['lastIdx'],'fields':[]})
                        nuevo = False

                        break
                    else:
                        actualid+=1
            else:
                print("now actualid: ", actualid)
                jsonarchivo = open("index.json","w+")
                if(nuevo):
                    if(first):
                        jsonfile['documents'].append({'filename':filename+".csv",'lastIndex':lastIndex,'fields':[]})
                        first = False
                    jsonfile['documents'][actualid]['fields'].append({'field'+str(counter):line['columnName']})
                json.dump(jsonfile, jsonarchivo, indent=4)
                jsonarchivo.close()
            print("counter? ", counter, " first? ", first)
        else:
            archivo.writerow([str(line['text'].encode('utf-8', 'surrogatepass').decode('utf-8')),str(line['value']),str(line['tag'])])
        counter+=1

    f = open(filename+'.csv', 'r+', encoding='utf-8')
    response = HttpResponse(f, content_type='text/csv;charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="'+filename+'.csv"'
    return response

@csrf_exempt
def recuperarSesion(request):
    print(request)
    nJson = json.loads(request.body.decode('cp1252',errors='replace').replace('\uFFFD', '?'))
    print("NJSON! ", nJson)
    name = nJson['filename']
    print("name: ", name)
    archivo = open("index.json","r+")
    cadena = archivo.read()
    jsonfile = json.loads(cadena)
    for idx, obj in enumerate(jsonfile.get('documents')):		
        if obj['filename'] == name:
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

