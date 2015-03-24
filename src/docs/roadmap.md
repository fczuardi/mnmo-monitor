Nome da tarefa | Trabalho | Início | Término | Progresso |
---------------|----------|--------|---------|--------------------|
Versão do código sem dependencia de ambiente node.js/npm | 35h | Sábado 14/03/2015 | Quarta 18/03 | 100% |
Tela de login | 60h | Segunda 09/03/2015 | Sexta 20/03/2015 | 88% |
Captcha | 7h | Segunda 23/03 | Terça 24/03 | 42% |
Side menu | 12h | Terça 24/03 | Quinta 26/03 | 0% |
App header e paineis | 51h | Sexta 27/03 | Terça 14/04 | 0% |
Dashboard | 88h | Terça 14/04 | Quarta 06/05 | 0% |
Gráficos | 36h | Quarta 06/05 | Quinta 14/05 | 0% |
Detalhe | 53h | Quinta 14/05 | Quarta 27/05 | 0% |
Splash Screen | 17h | Quarta 27/05 | Terça 02/06 | 0% |
Navegadores antigos | 50h | Terça 02/06 | Terça 16/06 | 20% |
Desenvolvimento total | 409 | - | Terça 16/06 | 21% |
Liberação do código open source | - | 16/09 |  |  |

__última atualização: 24/03/13:30__

-----

Total 
-----
- 87/409 = 21.27%

Cálculo
-------

### Login (53/60)

- portar/refatorar de xxx-login para o novo estilo classico
    - layout (15/15) = OK
    - stores (15/20)
- casos de erro
    - implementar (3)
    - pedir um layout de exemplo (5) = OK
- trabalho feito até 16/03 (17) = OK

#### Captcha (3/7)

- implementar cores, fontes e layout do PSD (3) = OK
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
- 0/32 = 0%

### Componentes
- migrar os estilos de export default {} para export default function(){} (5)
- achar uma solucao melhor para merge de styles sem objectAssign (ver /lib/checkbox e /lib/submit) (10)

### Versão sem bundle (0/15)
- usar babel [external helpers][externalhelpers] (10)
- adicionar docblock em todos os estilos para facilitar achar onde está o css (5)

### Build tasks
- eliminar linhas gigantes que copiam as fontes Roboto (2)
 
-----

Update 16/03-20/03
==================

## Mudança de repositório

Foi criado um repositório e versão da app que não requer pré-compilação para funcionar. Basta jogar todos os arquivos em um servidor de arquivos estáticos comum (IIS Server por exemplo) e tudo funciona. O endereço foi enviado por email.

Pode ser acessado em https://github.com/fczuardi/xxx-traditional e quem precisar de acesso pode me enviar um email com o username do github que eu adiciono como colaborador.

A versao da aplicação deste repositório se encontra menos funcional que a versão do bitbucket (que pode ser acessada em http://xxx-login.nulo.com.br ) pois eu aproveitei esta oportunidade para melhorar o código dos componentes e rever algumas dependencias (hoverboar e react-router). Minha previsão é que até segunda o repositório novo "alcance" o velho em termos de funcionalidades.

## Próximas etapas

Para a semana que vem o plano é:
- terminar de mover as stores do bitbucket (esta aplicação se baseia na arquitetura Flux, ver http://facebook.github.io/flux/docs/overview.html para entender como ela se compara com uma MVC, não estamos usando MVC) para o repositório novo até o fim da segunda feira.
- matar o captcha até o fim da terça
- implementar os componentes e design necessários para o menu-gaveta lateral até o fim da semana.

Cronograma sempre atualizado com o progresso disponível em: http://fczuardi.github.io/tcnet-traditional/docs/schedule.html

# Interno 

Por decorrencia desta adaptação o que antes era um único repositório, agora são 3: dois internos totalmente fechados (nem o cliente tem acesso) durante o periodo do desenvolvimento e um privado que o cliente tem acesso que é gerado a partir destes dois.
    - https://github.com/fczuardi/mnmo-components
    - https://github.com/fczuardi/mnmo-monitor
- estes dois repositórios, uma biblioteca de componentes React e uma applicação de monitoramento de dados que utiliza estes componentes já são os que serão lançados com licença open source ao fim do período de exclusividade, estes dois repositórios dependem de um ambiente com node.js instalado, mas é irrelevante, já que o cliente não precisará dar manutenção em nenhum destes.
- para diferenciar o que é do cliente e o que é patrocinado pelo cliente mas será aberto no futuro, o prefixo mnmo- é usado nos nomes dos repositórios e nas referencias a eles no código.

-----


#### Versão do código sem dependencia de ambiente node.js/npm (35/35)

- migrar o código do projeto xxxxx-login para este novo (20/20) = OK
- fazer um pré-repositório que "compila" para um repositório mais tradicional sem dependencia de node e npm (10) = OK
- reuniao para tentar integrar um projeto dependente de node na IDE do cliente (5) = OK



[externalhelpers]: https://babeljs.io/docs/usage/external-helpers/
