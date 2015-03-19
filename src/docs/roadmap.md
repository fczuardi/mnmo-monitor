Nome da tarefa | Trabalho | Início | Término | Progresso |
---------------|----------|--------|---------|--------------------|
Versão do código sem dependencia de ambiente node.js/npm | 35h | Sábado 14/03/2015 | Quarta 18/03 | 100% |
Tela de login | 45h | Segunda 09/03/2015 | Sexta 20/03/2015 | 60% |
Captcha | 7h | Segunda 23/03 | Terça 24/03 | 0% |
Side menu | 12h | Terça 24/03 | Quinta 26/03 | 0% |
App header e paineis | 51h | Sexta 27/03 | Terça 14/04 | 0% |
Dashboard | 88h | Terça 14/04 | Quarta 06/05 | 0% |
Gráficos | 36h | Quarta 06/05 | Quinta 14/05 | 0% |
Detalhe | 53h | Quinta 14/05 | Quarta 27/05 | 0% |
Splash Screen | 17h | Quarta 27/05 | Terça 02/06 | 0% |
Navegadores antigos | 50h | Terça 02/06 | Terça 16/06 | 20% |
Desenvolvimento total | 394h | - | Terça 16/06 | 15.7% |
Liberação do código open source | - | 16/09 |  |  |

__última atualização: 19/03/10:02__

-----

Total 
-----
- 62/394 = 15.7%

Cálculo
-------

### Login (27/45)

- portar/refatorar de xxx-login para o novo estilo classico
    - layout (10/15)
    - stores (5)
- casos de erro
    - pedir um layout de exemplo (5)
    - implementar (3)
- trabalho feito até 16/03 (17) = OK

#### Captcha (0/7)

- implementar cores, fontes e layout do PSD (3)
- API GET call para carregar pergunta
    - retorno deve trazer 1 pergunta e 3 respostas e talvez algum indicador da sessao?
    - respostas vem como imagem ou texto? (2)
    - feedback de resposta correta vs errada (2)

### Slide menu (12)

- fechar em uma biblioteca para assets mobile, bootstrap? (8)
- widget botao on-off (2)
- radio-box na forma de lista, para linguas (2)
- funcionalidade de logout (OK)
- clique em emissoras abrir outro menu (OK);

### App Header + Paineis (51)
- botao abre-fecha slide (3)
- botoes que abrem modals de seleção (2)
- paineis de selecao:
    - P (6)
    - I (6)
    - M (34)

### Dashboard (52 + 36 = 88)
- chamadas a API para montar o load inicial (5)
    - depois chamar a cada minuto (2)
- indicador de auto update (1)
- botao "ver medias" (4)
- header da tabela com ícones (3)
    - ir diminuindo até caberem 5 na largura da tela (3)
- primeira coluna com label duplo em cada celula e icone (3)
- linhas zebra (1)
- versao que compara duas variaveis em cada linha (10)
- cor ao lado para indicar estado dos dados (3)
- scroll horizontal p/ quando forem mais de 5 colunas (5)
- scroll vertical que leva o grafico junto e para na altura (10)
- retangulo extra mostrando o dia (2)

#### Gráficos (36)
- integrar d3 com react (10)
- graficos de barra (4)
- graficos de linha sobre as barras (8)
- labels numericos segundo o layout (5)
- largura das barras na mesma das colunas (2)
- grafico de pizza (4)
- barras com as cores de legenda na largura das colunas da tabela (3)

### Detalhe (53)
- chamadas a API (6)
- tabela comparando 3 variaveis (6)
- clique para selecionar coluna (5)
- mosaico de imagens (10)
- slider (6)
- grafico de linha (20)


### Splash Screen (17)
- texto, escolher entre fonte ou png e implementar (4)
- label da versão pode vir do package.json (1)
- imagem de fundo (responsividade/media queries)
    - carregar a versao mobile ou se em tela larga, carregar a versao desktop (3)
    - se em tela mais larga, escalar proporcionalmente (1)
    - estudar melhor solucao entre inline/js vs tradicional css (2)
- appcache e verificar se existe versão mais nova (6)

### Desktop (29)
- mouseover em varias coisas (10)
- responsividade (10)
- tooltips (4)
- thumbnails (5)

### Navegadores antigos (10/50)
- polyfills (10/20)
- css alternativos (10)
- markups alternativos (10)
- hacks (20)

-----

Bookmarks
=========

- Matterial UI = http://material-ui.com/#/components/date-picker

Bikeshedding
============

Total
-----
- 0/10 = 0%

### Versão sem bundle (0/10)
- usar babel [external helpers][externalhelpers] (10)

-----

Update 16/03-20/03
==================


#### Versão do código sem dependencia de ambiente node.js/npm (35/35)

- migrar o código do projeto xxxxx-login para este novo (20/20) = OK
- fazer um pré-repositório que "compila" para um repositório mais tradicional sem dependencia de node e npm (10) = OK
- reuniao para tentar integrar um projeto dependente de node na IDE do cliente (5) = OK



[externalhelpers]: https://babeljs.io/docs/usage/external-helpers/
