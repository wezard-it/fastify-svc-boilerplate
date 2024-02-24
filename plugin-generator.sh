#!/bin/bash

# Chiedi all'utente il nome del plugin
echo "Inserisci il nome del plugin (plurale):"
read pluginName

# Crea la directory di destinazione se non esiste
mkdir -p ./src/plugins/${pluginName}

# Elenco dei file da processare
files=("template.controller.ts" "template.repository.ts" "template.routes.ts" "template.service.ts" "template.types.ts")

# Processa ogni file
for file in "${files[@]}"
do
  # Crea il nuovo nome del file sostituendo 'template' con il nome del plugin
  newFileName=$(echo $file | sed "s/template/$pluginName/")

  # Sostituisci 'template' con il nome del plugin nel contenuto del file e sposta il file nella directory del plugin
  sed "s/template/$pluginName/g" "./pluginTemplate/$file" > ./src/plugins/${pluginName}/$newFileName
done

echo "I file del plugin '$pluginName' sono stati creati nella directory ./src/plugins/$pluginName"