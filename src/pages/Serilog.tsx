import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Serilog() {
  return (
    <PageContainer
      title="Logging estruturado com Serilog"
      subtitle="Logs como dados consultáveis, não como blocos de texto perdidos no terminal."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Logs antigos eram strings: <em>"Pedido 1234 falhou ao processar pagamento de R$ 50,00"</em>. Bonito de ler, péssimo de pesquisar. Imagine procurar "todos os pedidos do cliente X com falha de pagamento": você precisaria de regex frágeis. <strong>Logging estruturado</strong> resolve isso emitindo eventos como objetos com propriedades nomeadas — fica trivial filtrar, agregar e analisar. <strong>Serilog</strong> é a biblioteca mais popular de structured logging em .NET. Pense nela como a diferença entre um diário escrito à mão e uma planilha: ambos guardam fatos, mas só a planilha responde "quantos eventos ontem?" sem reler tudo.
      </p>

      <h2>Instalação</h2>
      <pre><code>{`dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
dotnet add package Serilog.Sinks.Seq            # Seq local
dotnet add package Serilog.Enrichers.Environment
dotnet add package Serilog.Settings.Configuration`}</code></pre>

      <h2>Configuração mínima</h2>
      <pre><code>{`// Program.cs
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
app.Run();`}</code></pre>
      <p>
        <strong>Sinks</strong> são destinos: console, arquivo, Seq, Elasticsearch, Application Insights, etc. <strong>Enrichers</strong> adicionam contexto a cada evento (nome da máquina, ambiente, request id). <code>UseSerilogRequestLogging</code> adiciona uma linha por requisição HTTP com método, rota, status e tempo — substitui o log barulhento default do ASP.NET com um único evento estruturado.
      </p>

      <h2>String concat vs structured logging</h2>
      <p>
        Esta é a diferença que define tudo:
      </p>
      <pre><code>{`// RUIM — string já interpolada; vira texto opaco no destino
_log.LogInformation($"Pedido {pedido.Id} processado para cliente {cliente.Nome}");

// BOM — placeholders nomeados; valores vão como propriedades estruturadas
_log.LogInformation("Pedido {PedidoId} processado para cliente {ClienteNome}",
    pedido.Id, cliente.Nome);`}</code></pre>
      <p>
        No segundo caso, um sink como Seq armazena dois campos consultáveis: <code>PedidoId = 1234</code> e <code>ClienteNome = "Ana"</code>. Você pode filtrar com <code>PedidoId = 1234</code> ou agrupar por <code>ClienteNome</code>. No primeiro, é só uma string que precisa de regex.
      </p>

      <AlertBox type="info" title="A regra do @">
        Para serializar um objeto inteiro como JSON em vez de chamar <code>ToString()</code>, prefixe o placeholder com <code>@</code>: <code>_log.LogInformation("Pedido recebido: &#123;@Pedido&#125;", pedido)</code>. Sem <code>@</code>, você só veria o nome da classe.
      </AlertBox>

      <h2>Configuração via appsettings.json</h2>
      <p>
        Em produção, é melhor controlar log via configuração — assim você muda nível sem recompilar.
      </p>
      <pre><code>{`{
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
}`}</code></pre>

      <h2>Níveis de log</h2>
      <p>
        Do mais ruidoso ao mais grave: <strong>Verbose</strong>, <strong>Debug</strong>, <strong>Information</strong>, <strong>Warning</strong>, <strong>Error</strong>, <strong>Fatal</strong>. Configure o mínimo que será emitido — abaixo dele, a chamada vira no-op sem custo. A regra prática: produção fica em <code>Information</code> com overrides para bibliotecas barulhentas.
      </p>
      <pre><code>{`_log.LogTrace("Detalhe muito fino, só em debug profundo");
_log.LogDebug("Variável x = {X}", x);
_log.LogInformation("Usuário {UserId} fez login", userId);
_log.LogWarning("Cache miss para chave {Chave}", chave);
_log.LogError(ex, "Falha ao salvar pedido {PedidoId}", id);
_log.LogCritical("Banco indisponível, derrubando processo");`}</code></pre>
      <p>
        Para erros, <strong>sempre</strong> passe a exceção como primeiro argumento. Serilog a serializa com stack trace completo e a expõe como propriedade <code>Exception</code> consultável.
      </p>

      <h2>Contexto compartilhado: LogContext</h2>
      <p>
        Em uma requisição HTTP, vários componentes (controller, serviço, handler) emitem logs. Você quer que <em>todos</em> tenham, por exemplo, o <code>RequestId</code>, sem precisar passar como parâmetro. Use <code>LogContext.PushProperty</code> ou um middleware:
      </p>
      <pre><code>{`app.Use(async (ctx, next) =>
{
    using (Serilog.Context.LogContext.PushProperty("RequestId", ctx.TraceIdentifier))
    using (Serilog.Context.LogContext.PushProperty("UserId",
        ctx.User.Identity?.IsAuthenticated == true ? ctx.User.Identity.Name : "anon"))
    {
        await next();
    }
});`}</code></pre>
      <p>
        Tudo logado durante essa requisição automaticamente carrega esses campos. No Seq, basta filtrar por <code>RequestId = ...</code> para ver a "linha do tempo" inteira de uma chamada.
      </p>

      <AlertBox type="warning" title="Cuidado com PII">
        Logs estruturados ficam guardados em sistemas de busca. Não logue senhas, tokens, CPFs, dados de cartão. Use mascaramento (<code>{`{Cpf:mask}`}</code>) ou enriquecedores que filtrem propriedades sensíveis. LGPD/GDPR aplicam-se a logs também.
      </AlertBox>

      <h2>Visualizando: Seq local</h2>
      <p>
        <strong>Seq</strong> é uma ferramenta gratuita (para uso pessoal) que recebe logs estruturados e oferece busca SQL-like, dashboards, alertas. Roda em Docker:
      </p>
      <pre><code>{`docker run -d --restart unless-stopped --name seq \\
  -e ACCEPT_EULA=Y \\
  -p 5341:80 \\
  datalust/seq:latest

# Abra http://localhost:5341 e veja logs em tempo real`}</code></pre>
      <p>
        Em produção, alternativas são Elastic/Kibana, Grafana Loki, Datadog, Splunk, Application Insights. O contrato (Serilog) não muda — só o sink.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Interpolar com <code>$"..."</code></strong> em vez de placeholders nomeados — perde a estrutura.</li>
        <li><strong>Esquecer <code>UseSerilog</code> no host</strong> — o ILogger ainda funciona via console, mas sem sinks configurados.</li>
        <li><strong>Logar exceção como string</strong> (<code>ex.Message</code>) — perde stack trace.</li>
        <li><strong>Sink de arquivo sem rolling</strong> — log gigante que come o disco.</li>
        <li><strong>Logar dentro de hot path</strong> com nível alto — pode dominar o CPU.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Logging estruturado torna logs consultáveis como dados.</li>
        <li>Sempre use placeholders nomeados (<code>{`{Id}`}</code>), nunca interpolação.</li>
        <li>Configure sinks por ambiente; use <code>appsettings.json</code> para flexibilidade.</li>
        <li>Enriqueça com contexto compartilhado (RequestId, UserId).</li>
        <li>Visualize com Seq (dev) ou Elastic/Loki/Datadog (prod).</li>
      </ul>
    </PageContainer>
  );
}
