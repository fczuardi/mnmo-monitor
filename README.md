Instalacao do ambiente de dev:
=============================

Rede
-------

Este projeto usa o tanto o github quanto npm registry como repositórios de
código e dependências. Ambos transferem arquivos via conexões encriptada (SSL).

Idealmente isso pode ser feito por https, porém algumas redes corporativas
não usam CAs normais ou usam seus próprio root CA, o que causa boa parte dos
endereços do mundo darem erros de certificado. Uma alternativa ao uso de https
para ```git clone``` e para ```npm install``` é usar o git via SSH e o npm por
http normal.

Para usar o git via SSH, você vai precisar [gerar um par de chaves][keygeneration]
na sua máquina e [cadastrar a chave pública na sua conta do GitHub][addkeytogithub]
o SSH por padrão usa a porta 22, e essa porta em alguns ambientes coorporativos
também pode estar bloqueada, se esse for o caso, veja como mudar a porta padrão
do SSH para alguma outra aberta (443 por exemplo).

Antes de começar a reproduzir o ambiente, certifique-se que sua rede / firewall
possui as regras necessárias para o bom funcionamento do git e do 
gerenciador de pacotes (npm ou yarn).

Se a porta 22 for bloqueada você pode tentar configurar seu ssh para usar a 
porta 443 que tem mais chances de estar aberta (por causa do navegador).

Um exemplo de configuração para acessar github via ssh pela porta 443:

arquivo: *~/.ssh/config*
```
Host github.com
  Hostname ssh.github.com
  Port 443
```

Para clonar o repositório via ssh ao invés de https, faça um Fork para a conta 
do seu usuário e configure uma chave publica da sua maquina no github.

![01_fork](https://cloud.githubusercontent.com/assets/7760/20060618/241ac6da-a4e3-11e6-91dd-771a211a86a9.png)
![02_use_ssh](https://cloud.githubusercontent.com/assets/7760/20060617/240da306-a4e3-11e6-9bda-fa74b60c9d97.png)
![03_ssh_url](https://cloud.githubusercontent.com/assets/7760/20060616/23e6049a-a4e3-11e6-8ce1-d2f802d17315.png)

[keygeneration]: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
[addkeytogithub]: https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/

1 git
---
- instalar git caso nao tenha na maquina
  - https://git-scm.com/downloads
  - aproveite para escolher boas opcoes de instalação, como a quebra de linha
  LF do Unix SEMPRE. E o terminal Git Bash que é centenas de vezes melhor que 
  o cmd.exe.
  
  Ver screenshots abaixo.
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

(use as urls dos seus forks, por exemplo git@github.com:*SEU_USER_NAME*/mnmo-monitor.git)

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
- https://github.com/fczuardi/mnmo-components/archive/master.zip
- https://github.com/fczuardi/tcnet-traditional/archive/master.zip
- https://github.com/fczuardi/mnmo-monitor/archive/master.zip
- extraia os 4 zips debaixo de um mesmo subdiretorio de forma que sejam pastas irmãs

### 3.a.a renomear pastas
- renomeie as pastas para nao ter o -master do fim, ex: global-flummox-master > global-flummox
- renomear pasta tcnet-traditional para monitor-traditional

### 3.a.b desabilitar temporariamente o ssl pro npm
- https://github.com/npm/npm/issues/9580#issuecomment-166605021
Diretorio default do arquivo npmrc:  C:\Program Files\nodejs\node_modules\npm

4 Instalar as dependencias do mnmo-monitor
------------------------------------------

### 4.0 set npm loglevel to http for more feedback and color always for colorful outputs
- npm config set loglevel http
- npm config set color always

### 4.1 global-flummox
- cd global-flummox
- npm install
- npm run mkdir
- npm run js

Existe uma issue aberta para simplificarmos a instalação dessa dependência: https://github.com/fczuardi/tcnet-traditional/issues/193<Paste>

E uma issue para cortá-la por completo, substituindo-a por uma implementação
mais moderna do flux: https://github.com/fczuardi/tcnet-traditional/issues/194

### 4.2 mnmo-components
- cd ../mnmo-components
- npm install
- npm run fontwin
  - ou ```npm run font``` se estiver em Linux/Mac
- npm run npmwin
  - ou ```npm run npm``` se estiver em Linux/Mac

Existe uma issue aberta para simplificarmos a instalação dessa dependência: https://github.com/fczuardi/tcnet-traditional/issues/190

### 4.2 mnmo-monitor dependencies
- cd ../mnmo-monitor
- npm install --no-optional
- npm run font
- npm run copy:secrets


5 gerar versão "clássica" da app
--------------------------------
- npm run www
- a build ficará em ./dist/classic

### 5.1 subir o server local
- npm run start
- abrir o navegador em http://localhost:7001

6 depois que o patch estiver ok
--------------------------------
- git commit -am "mensagem"
- npm version patch
- git push
- git push --tags

7 atualizar repositorio -traditional com as mudancas
--------------------------------

### 7.1 Gerar branch "bundled" do -traditional
- npm run branded
- npm run branded-branch
- cd ../monitor-traditional
- git commit, push
- git checkout master (para voltar para a branch master)
- cd ../mnmo-monitor (para voltar para o mnmo-monitor)

Este script não é compatível com Windows ainda, existe uma issue aberta para
fazer essa adaptação: https://github.com/fczuardi/tcnet-traditional/issues/195

### 7.2 Gerar branch "master" do -traditional
- npm run classic
- cd ../monitor-traditional
- git status, git commit, git push
