Instalacao do ambiente de dev:
=============================


1 node.js
----------
- https://nodejs.org/en/
- download link: https://nodejs.org/dist/v6.2.2/node-v6.2.2-x86.msi
- installl
- test the installation
  - open command prompt and type: ```node --version```

2 git
---
- instalar git caso nao tenha na maquina
  - https://git-scm.com/downloads
- para saber se tem git na maquina digite ```git --version```


3 clone the mnmo-monitor and git repos
------------------------------------
- ```git clone https://github.com/fczuardi/global-flummox```
- ```git clone https://github.com/fczuardi/mnmo-monitor.git```
- ```git clone https://github.com/fczuardi/tcnet-traditional.git```

### 3.a se o git clone nao funcionar, baixe os zips:
- https://github.com/fczuardi/global-flummox/archive/master.zip
- https://github.com/fczuardi/tcnet-traditional/archive/master.zip
- https://github.com/fczuardi/mnmo-monitor/archive/master.zip
- extraia os 3 zips debaixo de um mesmo subdiretorio de forma que sejam pastas irmãs

### 3.b renomear pastas
- renomeie as pastas para nao ter o -master do fim, ex: global-flummox-master > global-flummox
- renomear pasta tcnet-traditional para monitor-traditional

### 3.c desabilitar temporariamente o ssl pro npm
- https://github.com/npm/npm/issues/9580#issuecomment-166605021
Diretorio default do arquivo npmrc:  C:\Program Files\nodejs\node_modules\npm

4 Instalar as dependencias do mnmo-monitor
------------------------------------------

### 4.1 global-flummox
- cd global-flummox
- npm install
- npm run mkdir
- npm run js

### 4.2 mnmo-monitor dependencies
- cd ../mnmo-monitor
- npm install
- npm run font
- npm run copy:secrets


5 gerar versao "clássica" da app
--------------------------------
- npm run www
- a build ficará em ./dist/classic

### 5.1 subir o server local
- npm run start
- abrir o navegador em http://localhost:7001
