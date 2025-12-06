## O fluxo de dados será:
1. **Coletor(Python):** Pergunra para a API OpenWeather: "Como está o tempo?" -> Recebe o JSON -> Coloca na caixa de correio do RabbitMQ.
2. **RabbitMQ:** Guarda a mensagem na fila.
3. **Worker(Go):** Fica olhando a caixa de correio. Quando chegar carta, pega, processa e envia para o NestJS.
4. **API (NestJs):** Salva no aquivo(MongoDB) e mostra para o FrontEnd que pedir.

## ✅ Checklist rápido
- [x] Python coleta dados de clima (OpenWeather)  [completion:: 2025-11-20]
	- [x] Estudar a API, Saber como e quis parâmetros preciso  [completion:: 2025-11-20]
	- [x] Entender quais dados sempre vou receber, quis pode ser que eu receba e o formato que ele chegam  [completion:: 2025-11-20]
- [x] Python envia dados para RabbitMQ  [completion:: 2025-11-22]
	- [x] Estudar o RabbitMQ  [completion:: 2025-11-22]
	- [x] Como o RabbitMQ vai receber esse dados  [completion:: 2025-11-22]
- [x] Worker Go consome a fila e envia para a API NestJS  [completion:: 2025-11-22]
	- [x] Estudar o Go, ==como funciona worker no Go==.  [completion:: 2025-11-22]
	- [x] Como o Go vai consumir a fila.  [completion:: 2025-11-22]
	- [x] Enviar a fila para a API NestJS.  [completion:: 2025-11-26]
- [x] API NestJS:  [completion:: 2025-11-26]
    - [x] Armazena logs de clima em MongoDB  [completion:: 2025-11-26]
    - [x] Expoe endpoints para listar dados  [completion:: 2025-11-28]
    - [x] Gera/retornar insights de IA (endpoint próprio)  [completion:: 2025-11-29]
	    - [x] Os insights já estarão prontos aqui, só receber.  [completion:: 2025-11-29]
    - [x] Exporta dados em CSV/XLSX  [completion:: 2025-11-28]
	    - [x] O backend deve expor endpoints para exportar dados de clima em **CSV** e **XLSX**;  [completion:: 2025-11-28]
	    - [x] O frontend deve oferecer botões no Dashboard para fazer o download desses arquivos.  [completion:: 2025-12-01]
    - [x] Implementa CRUD de usuários + autenticação  [completion:: 2025-12-03]
    - [x] Aplicar _Insights_ de IA  [completion:: 2025-12-01]
		- [x] Texto explicativo (“Alta chance de chuva nas próximas horas”);  [completion:: 2025-12-01]
		- [x] Cards com alertas (“Calor extremo”, “Clima agradável”);  [completion:: 2025-12-01]
		- [x] Gráficos ou visualizações adicionais.  [completion:: 2025-12-03]
    - [x] (Opcional) Integração com API pública paginada  [completion:: 2025-12-03]
- [x] Frontend React + Vite + Tailwind + shadcn/ui:  [completion:: 2025-12-01]
    - [x] Dashboard de clima com dados reais  [completion:: 2025-12-01]
    - [x] Exibição de insights de IA  [completion:: 2025-12-01]
    - [x] CRUD de usuários + login  [completion:: 2025-12-03]
	    - [x] Tela de **login**;  [completion:: 2025-12-03]
	    - [x] Rotas protegidas (somente usuário autenticado acessa o Dashboard);  [completion:: 2025-12-03]
	    - [x] CRUD de usuários (listar, criar, editar, remover);  [completion:: 2025-12-03]
	    - [x] Uso de componentes do **shadcn/ui** (Button, Input, Table, Dialog, Toast, etc.); ==-> OBS: Configurar o TailwindCSS antes de instalar o shadcn/ui==  [completion:: 2025-12-01]
	    - [x] Feedback visual adequado (loading, erro, sucesso).  [completion:: 2025-12-01]
    - [x] (Opcional) Página consumindo API pública paginada  [completion:: 2025-12-01]
	    - [x] Lista de Pokémons com paginação + página de detalhes de um Pokémon;  [completion:: 2025-12-01]

Diferenciais(Upgrades após tudo pronto):
- [ ] Roleta a cada 5 min para capturar um pokemon aleatório.
- [ ] Atualização automática no front das temperaturas recebidas do back, sem precisar dar refresh(mostrar timer na tela)
- [ ] Pesquisar temperatura(Na page de Explorar, junto a api de pokemon) de um lugar e retornar pokemons de um tipo que combine com o clima (Ex. Temperatura > 30 = pokemons de fogo)
- [ ] Melhorar as funções de perfil, exibindo pokemon capturados, escolhendo uma local como preferido, para aplicar o monitoramento de tempo.
***
- [x] Docker Compose sobe todos os serviços  [completion:: 2025-12-03]
- [x] Código em TypeScript (backend e frontend)  [completion:: 2025-12-03]
- [ ]  Vídeo explicativo (máx. 5 minutos)
- [ ]  Pull Request via branch com seu nome completo
- [ ]  README completo com instruções de execução
- [x] Logs e tratamento de erros básicos em cada serviço  [completion:: 2025-12-03]
---
## Estrutura do projeto
```plaintext
desafio_gdash_2025_02/
├── docker-compose.yml           # O regente da orquestra
├── docker-compose.overrride.yml # Ambientes
├── .env                         # Variáveis globais
├── collector-weather/           # Serviço Python
├── worker-weather/              # Serviço Go
├── backend-api/                 # NestJS + TS
└── frontend/                    # React + Vite
```

### :LiGithub: config-docker_compose
Configurando o docker para ser o maestro, e sua partitura é ao `docker-compose.yml` que diz: "Maestro, suba a orquestra inteira, nesta ordem, conectando estes instrumentos". Com o comando `docker compose up`.
O Dokcer compose tem um funcionalidade nativa de **herança e sobreposição**. Quando roda o `docker compose up` primeiro ele lê o `docker-compose.yml` e em seguida procura por `docker-compose.override.yml`, Unindo os dois em uma única configuração final na memória
>[! 🐋 Docker]
>#### docker-compose.yml
>Representa a verdade absoluta na infraestrutura. Ele define o que é necessário par ao sistema funcionar independentemente de onde seja rodado.
>Nele é adicionado:
>	- Imagens: Qual versão do _MongoDB_ ou _RabbitMQ_
>	- Nome dos serviços
>	- Variáveis de ambiente internas
>	- Volumes de persistência: onde os dados são salvos para não sumirem caso o contêiner reinicie.
>
>#### docker-compose.override.yml
>Modifica a base para facilitar o desenvolvimento local, ==nunca deve ir para produção==, ele comuta os volumes para que noa precise rebildar o contêiner toda vez que altera algo.
>Nele é adicionado:
>  - Portas exportas
>  - Volumes de Código: Mapeando a pasta do meu pc para dentro do container, assim ao salvar um arquivo ele atualiza dentro do docker, sem precisar reconstruir a imagem
>  - Comando de Dev: rodar `npm run start:dev` em vez de `npm start`
> Não preciso de um _override_, devido a ele ser aplicado em ambiente de desenvolvimento (também em homologação), não há a nescessidade de telo no projeto. O override não vai para o deploy, nunca.
> >[!WARNING]
> >Nunca adicionar ao _override_ serviços como banco de dados e filas!!
Assim mantenho o ambiente limpo, facilitando para o deploy.

>[!TIP]
> Sempre com o docker rodando (`docker compose up -d`), quando for instalar uma nova dependência usar:
> > `docker exec -it desafioGDASH_backend npm install json2csv`
> Assim a dependência vai ser adicionado ao docker
> ***
> Para que ele seja copiada para o ambiente local, uso o:
> > `docker cp desafioGDASH_backend:/app/node_modules ./backend-api`

 

***

### :LiGithub: feat/collector_weather
O _collector_ segue a estrutura
```plaintext
desafio_gdash_2025_02/
├── backend/           
├── docker-compose.overrride.yml # Ambientes
├── .env                         # Variáveis globais
├── collector-weather/
├ ├── dockerfile
├ ├── main.py
├ └──requiriments.txt
├── worker-weather/              
├── backend-api/                 
└── frontend/                    
```

Pegando as Variaveis de ambiente do `.env` e, aplicando à consulta na api. A requeste tem um timeout de 10s
e os dados sao consultado a cada 60seg. 

### :LiGithub: feat/rabbitMQ
Arquitetura orientada a eventos.
Se o _pyhton_ tentasse salvar os dados do clima direto no Banco de Dados ou até mesmo, chamar a API NestJS via HTTP, estaria sujeito a problemas como:
- Perda dos dados climáticos em cenário de queda da API
- Se o Banco de Dadod Ficar lento, o cotllector fica travado aguardadno uma resposta para pode seguir coletando
Por fim, teria um sistema frágio, onde a queda de uma parde, derrubaria todo o resto.

Para solucionar isso, o **RabbitMQ** funciona como uma caixa magica de correios:
 - **O Python 🐍:** Não quer saber se o Go ou o Banco de Dados estão funcionando. Ele pega o dado, empacota num JSON e joga na caxa de correio do RabbitMQ. Entrega e pronto.
 - **o RabbitMQ 🐰:** Guarda esse envelopes em uma fila segura. SE ninguém vier buscar agora, ele segura lá por horas ou dias.
 - **O Go 🐶:** Quando estiver livre, vai ate a caixa, pega a próxima carta, abre e processa.

Aplicando o padrão de **Produtor-Consumidor**, desacoplei a Coleta do processamento, assim:
- **Produtor(Python):** Coleta os dados sem se importar com quem vai usar.
- **Broker(RabbitMQ):** Garante que a mesagem fique guardada(persistida) até alguém estar pronto para ler.
- **Fila(`weather_data`):** O buffer que segura os dados.
Durante os testes de log, tive um problema do log estar travando para iniciar e, depois de um tempo, ele soltava todo o log de uma vez só. Para contornar isso adicionei ao _dockerfile_ o: `{dockerfile icon} ENV PYTHONUNBUFFERED=1`

Pois, o python pro pafrao usa um "buffer" de saida, para guardar os `print()` na memória e só jogar na tela quando junta muita coisa ou quando o programa termina. No Docker, quero ver o _log_ em tempo real, a variável adicionada no _dockerfile_ diz: "Não guarde nada, jogue direto na saido padrão"

Passando par o **RabbitMQ**, no arquivo _rabbit.client.py_, manipulo dois objetos distintos:
1. **Connection(Conexão TCP):** Conexão com o servidor, pesada e lenta.
2. **Channel(Canal Virtual):** Um fio dentro na Connection, bem mais leve.
#### A idempotência
O seguinte código:
```python title=rabbit_client.py
channel.queue_declare(queue=config.QUEUE_NAME, durable=True)
```
é uma operação **idempotente**. Significa que mesmo rodando mil vezes o resultado é o mesmo
- Se a fila não existe: O **RabbitMQ** cria
- Se a fila já existe: O **RabbitMQ** não faz nada(apenas verifica se os parâmetros batem).
#### Persistência(`durable` e `delivery_mode`)
Duas camadinhas de segurança:
1. `durable=True` (na fila): Se o RabbitMQ reiniciar ou o servidor cair, a Fila continua existindo.
2. `delivery_mode=2` (na mensagem): Se o RabbitMQ reiniciar, as Mensagens dentro da fila são salvas no disco e recuperadas. Sem isso, elas ficariam apenas memória RAM e seriam perdidas no restart.

### :LiGithub: feat/worker-go
#### Go :LiDog:
O **Go**, tem a performance do C++, mas com a simplicidade semelhante ao Python.
Uma linguagem compilada que gera um arquivo executável que roda direto no processador. É muito rápido. Surgiu para resolver problemas de infraestruturas , servidores e sistemas distribuídos.
Em Go é usado a forma de **Structs** em vez de Classes/Objetos
```go title=main.go 
type WeatherData struct {
    City string  `json:"city"` // Mapeia o JSON automaticamente
    Temp float64 `json:"temp"`
}
```

Tipagem:
O Go adora inferência de tipos com o operador "Walrus" (`:=`).
- `{go icon} var x int = 10` (Declaração formal)   
- `{go icon} x := 10` (Atalho: o Go adivinha que é int. Você usará isso 90% do tempo).

###### Por que Go para o Worker?
Imaginando que o Python envie 10.000 mensagens de clima por segundo.
- Um worker em Node.js (Single Thread) teria que fazer malabarismo com o Event Loop.
- Um worker em Python (GIL) sofreria para processar em paralelo de verdade.
O Go tem as Grountines. São como "threads", mas super leves. Para o worker(RabbitMQ), significa que podemos processar menssagens de forma eficiente com pouquíssima memória.
##### Módulo
O arquivo `go.mod` funciona como o `packege.json` do NodeJs

```go title=go.mod
module weather-worker

go 1.21

require github.com/rabbitmq/amqp091-go v1.9.0
```
Dado o nome do projeto, a versão do Go e a declaração da biblioteca do RabbitMQ que será utilizada.

##### :LiBug: Variable Shadowing
Durando o desenvolvimento bati no seguinte erro `nil pointer dereference`
Esse problema apareceu ao fazer:
`{go icon} 	conn, err := amqp.Dial(...)`
Dentro de um if ou for, o operador `:=` cria uma nova variável `conn` que só existe ali dentro. A variável `conn` de for continuava vazia (`nil`). Para resolver, isolei a conexão na função _connectRabbitMQ_, retornando uma conexão pronta e válida.

Enquanto o Python aceita qualquer JSON, o Go exige um contrato, feito por meio da _struct_. Se o python mandar um campo `cidade`, o Go vai ignorar, pois esta esperando `city`. Isso torna o sistema robusto.

##### Goroutines (go func())
```go title=go
go func(){
	for d := range msgs {...}
}()
```
O `go` antes da função lança ela para ser rodada em "segundo plano", ou seja, o código segue sem esperar o _loop (for)_ terminar. Se tivesse 10 filas diferentes, poderia lançar 10 `go func()` e processar tudo simultaneamente, gastando pouquíssima memória.

Porem, com a `go func` rodando em segundo plano, o programa principal(`main`) chegaria ao fim do arquivo e fecharia o contêiner instantaneamente. Afim de evitar isso, declarando um canal vazio, travando o programa mantando o contêiner vivo para que o **Grountiens** continue trabalhando.
>[! 🐶 Go]
>Uma **goroutine** é uma thread de execução leve gerenciada pelo runtime do Go, permitindo que funções sejam executadas simultaneamente com outras funções dentro do mesmo programa. Ao contrário das threads tradicionais do sistema operacional, as **goroutines** são econômicas e têm sobrecarga mínima, começando com um pequeno tamanho inicial de pilha (normalmente em torno de 2 KB) que pode crescer dinamicamente conforme necessário, tornando-as muito mais eficientes em termos de memória.




### :LiGithub: feat/backend-setup
Arquitetura do NestJS:
O NestJs implementa uma arquitetura modular inspirada no Angular, fortemente baseada em Injeção de Dependência(DI) e Decorators (Meta programação)
1. **Incoming Request:** O servidor HTTP(express adapter) recebe a requisição TCP.
2. **Global Pipes**(`main.ts`): O `ValidationPipe` intercepta o body da requisição. Ele instancia a calsse do DTO, aplica as validações (`class-validator`) e rejeita a requisição se for inválida ou sanitiza os dados (converte tipos se for válida).
3. **Routing**(`weather.controller.ts`): O Router identifica qual método deve tratar a URL `/weather`.
4. **Business Logic**(`weather.services.ts`): O Controller delega a operação para o Service.
5. **Persistence**(Mongoose Model): O Service utiliza a abstração do Mongoose para comunicar com o driver do MongoDB
***
Os Arquivos:
`main.ts` (Bootstrap & Global Middleware)

É o ponto de entrada (`entrypoint`)
- **Função:** Inicializa o contexto da aplicação (`NestFactory.create`).
- **Global Pipes:** Aqui configuramos o `app.useGlobalPipes`. Isso injeta um middleware global que utiliza a biblioteca `class-transformer` para transformar JSON puro em instâncias de classes JavaScript e validá-las. Sem isso, os DTOs seriam apenas interfaces TypeScript que somem na compilação.

`app.module.ts` (Root Module & Configuration)

É o módulo raiz que compõe a árvore de dependências.
- **Dynamic Modules:** O `MongooseModule.forRoot()` é um _Módulo Dinâmico_. Ele configura a conexão assíncrona com o banco de dados e a disponibiliza globalmente (ou encapsulada) para outros módulos.
- **Module Composition:** Ele importa o `WeatherModule`, integrando o sub-grafo de dependências desse recurso ao grafo principal da aplicação.

#### `weather/weather.module.ts` (Feature Module & DI Scope)

Define um contexto isolado (Scope) para o domínio de Clima.
- **Encapsulamento:** Módulos no NestJS são singletons por padrão. Este arquivo instrui o **IoC Container** (Inversion of Control Container) sobre como instanciar as dependências deste domínio.
- **Providers Registration:** Registra o `WeatherService` como um _Provider_, tornando-o disponível para injeção dentro deste módulo.
- **Schema Registration:** O `MongooseModule.forFeature` cria o _Provider_ do Model (`WeatherLogModel`) baseado no Schema, permitindo que ele seja injetado no Service.

#### `weather/dto/create-weather.dto.ts` (Data Transfer Object)
Define o contrato de dados para entrada.
- **Runtime Validation:** Diferente de interfaces TypeScript (que somem após transpilação), DTOs em NestJS são classes reais. Os decorators (`@IsString`, `@IsNumber`) adicionam metadados que são lidos em tempo de execução pelo `ValidationPipe` para garantir a integridade dos dados antes de chegarem ao Controller.

#### `weather/weather.controller.ts` (Interface Layer)
Responsável apenas por receber e responder HTTP.
- **Routing Metadata:** Os decorators `@Controller('weather')` e `@Post()` registram as rotas na tabela de roteamento do framework.
- **Request Mapping:** O decorator `@Body()` extrai o corpo da requisição e instrui o framework a convertê-lo para a instância do DTO especificado.
- **Separation of Concerns:** O Controller **não deve** conter regra de negócio. Ele apenas orquestra a chamada para o Service.

#### `weather/weather.service.ts` (Service Layer)
Contém a lógica de negócio e persistência.
- **@Injectable():** Marca a classe como gerenciada pelo container de Injeção de Dependência.
- **Dependency Injection:** No construtor `{ts icon}constructor(@InjectModel(...) private model)`, ocorre a injeção. O NestJS busca no container a instância já criada do Model do Mongoose e a entrega para o Service. Isso desacopla o Service da criação manual do banco de dados, facilitando testes unitários (Mocking).
- 
#### `weather/weather.schema.ts` (ODM Definition)
Mapeia a classe TypeScript para uma Collection do MongoDB.
- **Schema Factory:** O Mongoose usa essas definições para criar a estrutura do documento, índices e validações no nível do banco de dados. É a "tradução" entre Objeto (App) e Documento (Banco).

#### (Design Patterns)
1. **Singleton:** Por padrão, Services e Modules no NestJS são Singletons. Uma única instância de `WeatherService` é criada na inicialização e reutilizada em todas as requisições, economizando memória.
2. **Decorator Pattern:** Usado extensivamente (`@Post`, `@Injectable`) para adicionar comportamento ou metadados a classes e métodos sem modificar seu código interno.
3. **Repository Pattern (via Mongoose):** O NestJS abstrai o acesso a dados. O `WeatherService` atua próximo a um repositório, isolando a lógica de acesso ao banco do resto da aplicação.

### :LiGithub: feat/export-csv
#### JSON vs. CSV
A chave aqui é traduzir uma linguagem da Web (JSON) para a linguagem de planilhas (CSV). E o problema dessa conversão é que o banco de dados (MongoDB) guarda dados como `timestamp` e nao pode ter objetos aninhados, o CSV precisa que tudo seja **String** e esteja na mesma linha.

#### Como forçar o Download?
Por padrão, quando um navegador acessa uma URL e recebe texto, ele exibe o texto na tela. Assim, para obrigar o navegador a abrir a janela de "Salvar Como...", é preciso manipular os **Headers** da resposta HTTP.
Existem dois headers fundamentais:
1. _Content-Type_: Diz para o navegador **o que** é aquele monte de bytes que estão chegando.
	- JSON: `applicantion/json`
	- CSV: `text/csv`
	- Excel: `applicantion/vnd.openxmlformats...`
2. _Content-Disposition_: Diz para o navegador **oque** fazer com que chegou para ele. 
	- **`inline`** (Padrão): Tente exibir na tela (ex: PDF abrindo na aba).
	- **`attachment`**: Baixe e salve no disco.

No **NestJs** é comum retornar apenas o dado. Porem, para enviar arquivos é preciso controle total sobre a resposta, para assim conseguir manipular seus  **Headers** usando o _decorator_ `@Res()`.
```TS title=weather.controller.ts
@Get('export)
exportCsv(@Res() res: Response) {
}
```
>[!WARNING]
>Quando o `@Res()` é aplicado, perde-se algumas automações do NestJS, como _interceptor_ padrão de respostas.

Para otimizar apliquei a biblioteca [_json2csv_](https://github.com/juanjoDiaz/json2csv), abstraindo a complexidade da conversão.

### :LiGithub: feat/insigths-ai
Para os _insigths_ de IA utilizarei a API do Gemini, apenas por ser free (Trial Free), assim posso utiliza-la sem demais problemas.

#### API's LLM
Funcionam baseadas em **Predição de Tokens.**

A API é sem estados, não lembrando do que foi chamado a 10 segundos atras, para o projeto o fluxo é:
1. **Input:** Pacote de conteúdo (instrução + Dados do Clima).
2. **Processamento:** O modelo preocessa tudo de uma vez.
3. **Output:** Retorna o _insight_.

SDK `@google/generative-ai`
O Google fornece um SDK oficial para Node.js que abstrai as chamadas HTTP brutas. ela gerencia a autenticação e a tipagem dos dados.
##### Principais Classes:
- `GoogleGenerativeAI`: Aclasse cliente principal, gerencia a API Key
- `GenerativeModel`: Instancia e especifica o modelo ( Flash ou Pro)
##### Parâmetros Críticos
| **_Parâmetro_**     | **_O que é?_**                        | **_Config_**                                                                                                   |
| ------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Model**           | O "cérebro" que vai processar.        | `gemini-1.5-flash` (Mais rápido, leve e barato).                                                               |
| **Prompt**          | O texto de entrada.                   | Uma _Template String_ combinando a instrução ("Aja como um meteorologista...") com os dados JSON (`temp: 25`). |
| **Temperature**     | O nível de aleatoriedade (0.0 a 2.0). | • `0.7` (Equilibrado).<br>• `0.1`: Robótico/Deterministico.<br>• `1.5`: Criativo/Caótico.                      |
| **MaxOutputTokens** | Limite de tamanho da resposta.        | **60**.<br>Isso força a IA a ser breve. Se ela tentar escrever um livro, é cortada. Economiza latência.        |
##### Estrutura do Payload
O código TypeScript vai contar e enviar uma objeto assim para o Google:
```json title=prompt
{
	"model": "models/gemini-1.5-flash",
	"components": [
		{
			"parts": [
				{ "text": "Aja como uma meteorologista.+ Dados"}
			]
		}
	],
	"generationConfig": { 
		"temperature": 0.7,
		"maxOutputTokens": 60
	}
}
```

O geminai retorna um obj complexo, pois pode gerar múltiplas respostas como "candidatos" para escolher a melhor. Sempre pegarei a primeira (`candidates[0]`).



### :LiGithub: feat/exports-xlsl
Tinha me esquecido de exportar também os dados em XLSX (Escel:LiFileSpreadsheet:), adicione a exportação e a forma como é feita é bem semelhante a exportação feita pelo CSV.
Adicionando a dependência `exceljs` para conversão de json em xlsx.
```ts hl:7,
res.set({

'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

'Content-Disposition': 'attachment; filename="clima_exports.xlsx"',

'Content-Length': bufferExcel.byteLength.toString(),
});
```

Adicionei também, o campo de insigth de AI nas planilhas, mas muito provavelmente vou remover.

Importante alteração, foi a modularizarão do serviços e exportação dos arquivos. Agora juntos no `export.service.ts`.

### :LiGithub: feat/frontend-setup
##### Configuração de Aliases (`@/`)
Para seguir o padrão do **shadcn/ui** e evitar caminhos relativos longos (`../../../components`), configuramos o Path Alias `@` apontando para a pasta `src`.

- **`vite.config.ts`:** Adicionado `resolve.alias` com `path.resolve`.
- **`tsconfig.json`:** Adicionado `"baseUrl": "."` e `"paths": { "@/*": ["./src/*"] }` para o TypeScript entender a importação.

##### Tailwind CSS (Versão e Compatibilidade)
Optamos por forçar a instalação do **Tailwind CSS v3.4.17** em vez da versão v4 (experimental/beta).
- **Motivo:** O ecossistema atual do `shadcn/ui` e muitos plugins de PostCSS ainda não são 100% compatíveis com a arquitetura da v4.
- **Configuração (`tailwind.config.js`):** Definimos manualmente as variáveis de cores (`hsl(var(--primary))`) para permitir a troca dinâmica de temas via CSS Variables.
##### Design System & Theming
- **Base:** Utilizamos a biblioteca `shadcn/ui` para componentes base (Button, Card, etc).
- **Branding:** A cor primária foi customizada para **Verde Água (#50e3c2)**.
    - Conversão HSL: `166.5 72% 60%`.
    - Aplicação: Editamos as variáveis CSS `--primary` e `--ring` no arquivo global.
- **Dark Mode:** Implementado via `ThemeProvider` (Context API) que manipula a classe `.dark` na tag `<html>`.
- **CSS Global:** Centralizamos tudo em `src/index.css` e removemos o `App.css` para evitar conflitos de especificidade.

### :LiGithub: feat/frontend-dashboar
Para o layout, decidi aplicar uma sidebar responsiva, com a navegação da página e o _toggle_ para escolha do tema. 

Para as cores não user o Hexadecimal(#50e3c2) direto no **Tailwind**. O **sadcn/ui** utiliza uma técnica avançada de theming baseada em CSS VAriables com valores **HSL(Hue, Saturation, Lightness)**.

Se as variáveis fossem definidas com `{css icon} --primary: #50e3c2` o **Tailwind** não conseguiria aplicar opacidade dinamicamente(`{css icon} bg-primary/50` 50% de opacidade) não funcionaria com Hex puro em variáveis CSS.
Isso é solucionado com o uso do **HSL**, definindo apenas o numero da cor:
`{css icon} --primary: 166.5 72% 60%; /* Matiz 166.5, Saturação 72%, Luz 60% */`
Assim, no `tailwind.config.js`, esses numeros de cor sao envelopados na função de cor:
```javascript title=tailwind.config.js
colors: { 
	primary: "hsl(var(--primary))", // O Tailwind monta: hsl(166.5 72% 60%)
}
```
Agora, quando a classe `bg-primary/20` for usada no React, o Tailwind gera automaticamente: 
`{css icon} background-color: hsl(166.5 72% 60% / 0.2);` Isso permite criar variações sutis da mesma cor (como fundos de cards) sem precisar criar novas variáveis.

#### Hooks
`useState`:
Gerenciando dados que mudam e precisar renderisar a tela:
```TypeScript title=dashboard
const [logs, setLogs] = useState<WeatherLog[]>([]); // Guarda os dados da API
const [loading, setLoading] = useState(true);       // Controla o esqueleto (loading)
```
```ts title=history-table.tsx
const [currentPage, setCurrentPage] = useState(1); // Página atual da tabela
```
`useState`:
Gerenciando coisas que acontecem "fora" da renderização, como chamadas de API.
```ts
useEffect(() => {
	fatchData();
}, []);
```

`useTheme`(Custom Hook/Context API):
Não nativa do React, mas a criei em `{tsx icon}theme-provider.tsx`
Permitindo que qualquer componente acesse e modifique o tema sem precisar passar props manualmente por todas a árvore de componentes(_Prop Drilling_)
`{tsx icon} const { theme, setTheme } = useTheme(); // Acessa o contexto global`

### :LiGithub: feat/pokemon-api
Respeitando a arquitetura e não chamando nenhuma api direto pelo front, a chamada para a poke-api foi completamente constuida no backend-api, com o NestJS.

##### paginação
A o Poké_API utiliza paginação baseada em **Offset** e **Limit**. O backend faz essa paginação.

Para saber quantos item "pular", apliquei essa formula:
	==_offset = (page - 1) x limit_== 
**Exemplo Prático (Limite de 20 itens):**
- **Página 1:** `(1 - 1) * 20` = Pula 0 (Começa do início).
- **Página 2:** `(2 - 1) * 20` = Pula 20 (Começa do 21º item).
- **Página 3:** `(3 - 1) * 20` = Pula 40.
```ts title=PokemonService
 async findAll(page: number = 1, limit: number = 20) { 
	 // 1. Tradução da Paginação
	 const offset = (page - 1) * limit;
	 // 2. Chamada Externa 
	 const response = await axios.get(this.BASE_URL, { 
		 params: { offset, limit }, // Envia os parâmetros traduzidos 
	 }); 
	 // 3. Retorno Padronizado (Meta-dados para o Frontend montar a paginação)
	 return {
		 data: response.data.results, // A lista de pokémons total:
		 response.data.count, // Total global (ex: 1300)
		 page, // Página atual 
		 limit, // Itens por página 
		 totalPages: Math.ceil(response.data.count / limit), // Cálculo de quantas  páginas existem 
	 };
}
```
No _PokemonController_, apliquei o decorators para expor essa lógica de forma documentada e tipada.
```ts title=PokemonController
@Get()
@ApiOperation({ summary: 'Lista Pokémons com paginação' })
findAll(
	@Query('page') page: string = '1',
	@Query('limit') limit: string = '20' 
) { 
// O '+' converte string para number antes de passar pro Service 
	return this.pokemonService.findAll(+page, +limit);
}
```

##### Destaques do Frontend
- **UX Híbrida:** A tela alterna suavemente entre dois modos:
    1. **Modo Lista:** Paginação numérica clássica.
    2. **Modo Busca:** Resultado único direto (Search Result).


### :LiGithub: feat/on-demand-insights-ai
Uma alteração importante, a mudança na forma de aplicar os _insights_ feito pela IA. Agora eu passo a ela uma pequena janela de contesto solicitada pelo usuário, passando os _insights_ para o modelo on-demand.
```ts title=analysis-request.dto.ts
export enum AnalysisContext {
	GENERAL = 'general',
	HEALTH = 'health',
	ACTIVITY = 'activity',
	OUTFIT = 'outfit',
}
```
### :LiGithub: feat/weather-charts
Implementação importante dos graficos para melhor analise dos dados coletados sobre temperatura. A primeira vista, adicionei dois 3 graficos exibindo melhor as informações sobre **temperatura, umidade e velocidade dos ventos**. Para isso user a os recharts do própio **shadcn/ui**.
- **Grid Modular:** Componente `ChartsGrid` que gerencia múltiplos tipos de gráfico.
- **Tipos de Visualização:**
    - **Temperatura:** Gráfico de Área (`AreaChart`) com gradiente (SVG `defs`) para visualizar volume e tendência.
    - **Umidade:** Gráfico de Barras (`BarChart`) para comparação quantitativa.
    - **Vento:** Gráfico de Linha (`LineChart`) do tipo `step` para visualizar rajadas.
- **Manipulação de Dados:** No Frontend recebo a lista LIFO do Backend e a inverto (`{js icon} .reverse()`) para renderização cronológica (Esquerda -> Direita).
### :LiGithub: feat/auth
Adotando uma pratica do NestJS, definindo assim a estrutura do auth:
```plantext
|
```
