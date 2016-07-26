Instalacao do ambiente de dev:
=============================

1 git
---
- instalar git caso nao tenha na maquina
  - https://git-scm.com/downloads
  - aproveite para escolher boas opcoes de instalação, como a quebra de linha verdadeira (LF, unix) e um terminal default melhor que o cmd.exe. Ver screenshots abaixo.
- para saber se tem git na maquina, abra o **Git Bash** e digite ```git --version```

![screen shot 2016-07-22 at 9 42 43 am](https://cloud.githubusercontent.com/assets/7760/17057566/2b4c3610-4ff1-11e6-823d-751aedd63283.png)

![screen shot 2016-07-22 at 9 43 54 am](https://cloud.githubusercontent.com/assets/7760/17057569/2d703bd0-4ff1-11e6-8ef4-106da737d608.png)


2 node.js
----------
- https://nodejs.org/en/
- download link: https://nodejs.org/dist/v6.3.1/node-v6.3.1-x86.msi
- installl
- test the installation
  - open **Git Bash** and type: ```node --version```


3 clone the mnmo-monitor and git repos
------------------------------------

Abra o Git Bash e digite:

```
cd ~
mkdir tcnet
cd tcnet
git clone https://github.com/fczuardi/global-flummox
git clone https://github.com/fczuardi/mnmo-components.git
git clone https://github.com/fczuardi/mnmo-monitor.git
git clone https://github.com/fczuardi/tcnet-traditional.git
```
(pule direto para o passo 4 se o git bash e os git clones funcionarem sem problemas.)

### 3.a se o git clone nao funcionar, baixe os zips:
- https://github.com/fczuardi/global-flummox/archive/master.zip
- https://github.com/fczuardi/tcnet-traditional/archive/master.zip
- https://github.com/fczuardi/mnmo-monitor/archive/master.zip
- extraia os 3 zips debaixo de um mesmo subdiretorio de forma que sejam pastas irmãs

### 3.a.a renomear pastas
- renomeie as pastas para nao ter o -master do fim, ex: global-flummox-master > global-flummox
- renomear pasta tcnet-traditional para monitor-traditional

### 3.a.b desabilitar temporariamente o ssl pro npm
- https://github.com/npm/npm/issues/9580#issuecomment-166605021
Diretorio default do arquivo npmrc:  C:\Program Files\nodejs\node_modules\npm

4 Instalar as dependencias do mnmo-monitor
------------------------------------------

### 4.0 set npm loglevel to http for more feedback
- npm config set loglevel http

### 4.1 global-flummox
- cd global-flummox
- npm install
- npm run mkdir
- npm run js

### 4.2 mnmo-components
- cd ../mnmo-components
- npm install
- npm run fontwin
  - ou ```npm run font``` se estiver em Linux/Mac
- npm run npmwin
  - ou ```npm run npm``` se estiver em Linux/Mac

### 4.2 mnmo-monitor dependencies
- cd ../mnmo-monitor
- npm install
- npm run font
- npm run copy:secrets


5 gerar versão "clássica" da app
--------------------------------
- npm run www
- a build ficará em ./dist/classic

### 5.1 subir o server local
- npm run start
- abrir o navegador em http://localhost:7001
