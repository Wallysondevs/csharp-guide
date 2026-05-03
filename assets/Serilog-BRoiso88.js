import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(r,{title:"Logging estruturado com Serilog",subtitle:"Logs como dados consultáveis, não como blocos de texto perdidos no terminal.",difficulty:"intermediario",timeToRead:"15 min",children:[e.jsxs("p",{children:["Logs antigos eram strings: ",e.jsx("em",{children:'"Pedido 1234 falhou ao processar pagamento de R$ 50,00"'}),'. Bonito de ler, péssimo de pesquisar. Imagine procurar "todos os pedidos do cliente X com falha de pagamento": você precisaria de regex frágeis. ',e.jsx("strong",{children:"Logging estruturado"})," resolve isso emitindo eventos como objetos com propriedades nomeadas — fica trivial filtrar, agregar e analisar. ",e.jsx("strong",{children:"Serilog"}),' é a biblioteca mais popular de structured logging em .NET. Pense nela como a diferença entre um diário escrito à mão e uma planilha: ambos guardam fatos, mas só a planilha responde "quantos eventos ontem?" sem reler tudo.']}),e.jsx("h2",{children:"Instalação"}),e.jsx("pre",{children:e.jsx("code",{children:`dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
dotnet add package Serilog.Sinks.Seq            # Seq local
dotnet add package Serilog.Enrichers.Environment
dotnet add package Serilog.Settings.Configuration`})}),e.jsx("h2",{children:"Configuração mínima"}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration) // lê do appsettings.json
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day)
    .WriteTo.Seq("http://localhost:5341"));

var app = builder.Build();
app.UseSerilogRequestLogging(); // log automático de cada request HTTP
app.MapGet("/", () => "ok");
app.Run();`})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Sinks"})," são destinos: console, arquivo, Seq, Elasticsearch, Application Insights, etc. ",e.jsx("strong",{children:"Enrichers"})," adicionam contexto a cada evento (nome da máquina, ambiente, request id). ",e.jsx("code",{children:"UseSerilogRequestLogging"})," adiciona uma linha por requisição HTTP com método, rota, status e tempo — substitui o log barulhento default do ASP.NET com um único evento estruturado."]}),e.jsx("h2",{children:"String concat vs structured logging"}),e.jsx("p",{children:"Esta é a diferença que define tudo:"}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM — string já interpolada; vira texto opaco no destino
_log.LogInformation($"Pedido {pedido.Id} processado para cliente {cliente.Nome}");

// BOM — placeholders nomeados; valores vão como propriedades estruturadas
_log.LogInformation("Pedido {PedidoId} processado para cliente {ClienteNome}",
    pedido.Id, cliente.Nome);`})}),e.jsxs("p",{children:["No segundo caso, um sink como Seq armazena dois campos consultáveis: ",e.jsx("code",{children:"PedidoId = 1234"})," e ",e.jsx("code",{children:'ClienteNome = "Ana"'}),". Você pode filtrar com ",e.jsx("code",{children:"PedidoId = 1234"})," ou agrupar por ",e.jsx("code",{children:"ClienteNome"}),". No primeiro, é só uma string que precisa de regex."]}),e.jsxs(o,{type:"info",title:"A regra do @",children:["Para serializar um objeto inteiro como JSON em vez de chamar ",e.jsx("code",{children:"ToString()"}),", prefixe o placeholder com ",e.jsx("code",{children:"@"}),": ",e.jsx("code",{children:'_log.LogInformation("Pedido recebido: {@Pedido}", pedido)'}),". Sem ",e.jsx("code",{children:"@"}),", você só veria o nome da classe."]}),e.jsx("h2",{children:"Configuração via appsettings.json"}),e.jsx("p",{children:"Em produção, é melhor controlar log via configuração — assim você muda nível sem recompilar."}),e.jsx("pre",{children:e.jsx("code",{children:`{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.EntityFrameworkCore": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/app-.log",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 14,
          "outputTemplate": "{Timestamp:HH:mm:ss.fff} [{Level:u3}] {Message:lj} {Properties:j}{NewLine}"
        }
      },
      { "Name": "Seq", "Args": { "serverUrl": "http://localhost:5341" } }
    ],
    "Enrich": [ "FromLogContext", "WithMachineName", "WithEnvironmentName" ],
    "Properties": { "Application": "MeuApi" }
  }
}`})}),e.jsx("h2",{children:"Níveis de log"}),e.jsxs("p",{children:["Do mais ruidoso ao mais grave: ",e.jsx("strong",{children:"Verbose"}),", ",e.jsx("strong",{children:"Debug"}),", ",e.jsx("strong",{children:"Information"}),", ",e.jsx("strong",{children:"Warning"}),", ",e.jsx("strong",{children:"Error"}),", ",e.jsx("strong",{children:"Fatal"}),". Configure o mínimo que será emitido — abaixo dele, a chamada vira no-op sem custo. A regra prática: produção fica em ",e.jsx("code",{children:"Information"})," com overrides para bibliotecas barulhentas."]}),e.jsx("pre",{children:e.jsx("code",{children:`_log.LogTrace("Detalhe muito fino, só em debug profundo");
_log.LogDebug("Variável x = {X}", x);
_log.LogInformation("Usuário {UserId} fez login", userId);
_log.LogWarning("Cache miss para chave {Chave}", chave);
_log.LogError(ex, "Falha ao salvar pedido {PedidoId}", id);
_log.LogCritical("Banco indisponível, derrubando processo");`})}),e.jsxs("p",{children:["Para erros, ",e.jsx("strong",{children:"sempre"})," passe a exceção como primeiro argumento. Serilog a serializa com stack trace completo e a expõe como propriedade ",e.jsx("code",{children:"Exception"})," consultável."]}),e.jsx("h2",{children:"Contexto compartilhado: LogContext"}),e.jsxs("p",{children:["Em uma requisição HTTP, vários componentes (controller, serviço, handler) emitem logs. Você quer que ",e.jsx("em",{children:"todos"})," tenham, por exemplo, o ",e.jsx("code",{children:"RequestId"}),", sem precisar passar como parâmetro. Use ",e.jsx("code",{children:"LogContext.PushProperty"})," ou um middleware:"]}),e.jsx("pre",{children:e.jsx("code",{children:`app.Use(async (ctx, next) =>
{
    using (Serilog.Context.LogContext.PushProperty("RequestId", ctx.TraceIdentifier))
    using (Serilog.Context.LogContext.PushProperty("UserId",
        ctx.User.Identity?.IsAuthenticated == true ? ctx.User.Identity.Name : "anon"))
    {
        await next();
    }
});`})}),e.jsxs("p",{children:["Tudo logado durante essa requisição automaticamente carrega esses campos. No Seq, basta filtrar por ",e.jsx("code",{children:"RequestId = ..."}),' para ver a "linha do tempo" inteira de uma chamada.']}),e.jsxs(o,{type:"warning",title:"Cuidado com PII",children:["Logs estruturados ficam guardados em sistemas de busca. Não logue senhas, tokens, CPFs, dados de cartão. Use mascaramento (",e.jsx("code",{children:"{Cpf:mask}"}),") ou enriquecedores que filtrem propriedades sensíveis. LGPD/GDPR aplicam-se a logs também."]}),e.jsx("h2",{children:"Visualizando: Seq local"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Seq"})," é uma ferramenta gratuita (para uso pessoal) que recebe logs estruturados e oferece busca SQL-like, dashboards, alertas. Roda em Docker:"]}),e.jsx("pre",{children:e.jsx("code",{children:`docker run -d --restart unless-stopped --name seq \\
  -e ACCEPT_EULA=Y \\
  -p 5341:80 \\
  datalust/seq:latest

# Abra http://localhost:5341 e veja logs em tempo real`})}),e.jsx("p",{children:"Em produção, alternativas são Elastic/Kibana, Grafana Loki, Datadog, Splunk, Application Insights. O contrato (Serilog) não muda — só o sink."}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Interpolar com ",e.jsx("code",{children:'$"..."'})]})," em vez de placeholders nomeados — perde a estrutura."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"UseSerilog"})," no host"]})," — o ILogger ainda funciona via console, mas sem sinks configurados."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Logar exceção como string"})," (",e.jsx("code",{children:"ex.Message"}),") — perde stack trace."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sink de arquivo sem rolling"})," — log gigante que come o disco."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Logar dentro de hot path"})," com nível alto — pode dominar o CPU."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Logging estruturado torna logs consultáveis como dados."}),e.jsxs("li",{children:["Sempre use placeholders nomeados (",e.jsx("code",{children:"{Id}"}),"), nunca interpolação."]}),e.jsxs("li",{children:["Configure sinks por ambiente; use ",e.jsx("code",{children:"appsettings.json"})," para flexibilidade."]}),e.jsx("li",{children:"Enriqueça com contexto compartilhado (RequestId, UserId)."}),e.jsx("li",{children:"Visualize com Seq (dev) ou Elastic/Loki/Datadog (prod)."})]})]})}export{a as default};
