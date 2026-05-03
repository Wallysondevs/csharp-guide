import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Middleware() {
  return (
    <PageContainer
      title="Middleware: o pipeline de requisições"
      subtitle="Entenda como o ASP.NET Core processa cada requisição em camadas e como criar suas próprias camadas customizadas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine uma fábrica de automóveis: o chassi entra de um lado da esteira e, ao longo dela, várias estações fazem operações específicas — pintura, instalação do motor, revisão final. No ASP.NET Core, cada requisição HTTP percorre uma esteira parecida, chamada de <strong>pipeline</strong>. Cada estação é um <strong>middleware</strong>: um trechinho de código que pode inspecionar a requisição, modificá-la, decidir se passa adiante ou se já devolve uma resposta. Entender esse pipeline é fundamental — é onde mora autenticação, CORS, logging, compressão e tratamento de erros.
      </p>

      <h2>O que é um middleware, tecnicamente</h2>
      <p>
        Um middleware é qualquer função (ou classe) que recebe um <strong>HttpContext</strong> (objeto com a requisição atual e a resposta sendo construída) e um <strong>RequestDelegate next</strong> — uma referência para o próximo middleware da fila. Ele faz seu trabalho, chama (ou não) <code>next(context)</code>, e pode rodar mais código depois que <code>next</code> retorna.
      </p>
      <pre><code>{`var app = builder.Build();

app.Use(async (context, next) =>
{
    // Antes de passar para o próximo middleware
    Console.WriteLine($"--> {context.Request.Method} {context.Request.Path}");

    await next(context);   // chama o próximo da fila

    // Depois que toda a cadeia respondeu
    Console.WriteLine($"<-- {context.Response.StatusCode}");
});

app.MapGet("/", () => "Olá!");

app.Run();`}</code></pre>
      <p>
        Esse padrão é chamado de "Russian doll" (boneca russa): cada middleware envolve a chamada do próximo. Você pode pular o <code>await next()</code> para "curtir-circuitar" o pipeline e devolver imediatamente.
      </p>

      <h2>Os três métodos: Use, Run e Map</h2>
      <p>
        O ASP.NET oferece três jeitos de adicionar coisas ao pipeline:
      </p>
      <ul>
        <li><code>app.Use(...)</code>: middleware que pode passar adiante (chama <code>next</code>).</li>
        <li><code>app.Run(...)</code>: middleware <em>terminal</em> — encerra a cadeia, sem chamar próximo. Geralmente fica no fim.</li>
        <li><code>app.Map("/admin", ...)</code>: cria uma "subesteira" que só processa requisições com o prefixo dado.</li>
      </ul>
      <pre><code>{`app.Map("/admin", adminApp =>
{
    adminApp.Use(async (ctx, next) =>
    {
        // Roda só em /admin/*
        if (!ctx.User.IsInRole("Admin"))
        {
            ctx.Response.StatusCode = 403;
            return;  // não chama next → encerra aqui
        }
        await next();
    });

    adminApp.Run(async ctx =>
    {
        await ctx.Response.WriteAsync("Bem-vindo, admin!");
    });
});`}</code></pre>

      <h2>A ORDEM IMPORTA — muito</h2>
      <p>
        Como cada middleware envolve o próximo, a sequência em que você os registra é o que define o comportamento da aplicação. A documentação oficial recomenda essa ordem para um app típico:
      </p>
      <pre><code>{`var app = builder.Build();

app.UseExceptionHandler("/erro");   // 1. Captura exceções
app.UseHttpsRedirection();          // 2. Força HTTPS
app.UseStaticFiles();               // 3. Serve wwwroot/
app.UseRouting();                   // 4. Decide qual endpoint vai responder
app.UseCors();                      // 5. CORS (depois de Routing!)
app.UseAuthentication();            // 6. "Quem é você?"
app.UseAuthorization();             // 7. "Você pode entrar aqui?"
app.MapControllers();               // 8. Executa o endpoint
app.Run();`}</code></pre>
      <p>
        Errar essa ordem causa bugs sutis: <code>UseAuthorization</code> antes de <code>UseAuthentication</code> deixa todos como anônimos; <code>UseStaticFiles</code> depois de autenticação obriga login para baixar o CSS; <code>UseCors</code> antes de <code>UseRouting</code> não funciona corretamente.
      </p>

      <AlertBox type="warning" title="A regra de ouro">
        Pense no pipeline como filas em um aeroporto: <strong>identificação</strong> antes de <strong>controle de acesso</strong>; <strong>raio-x</strong> antes do <strong>portão de embarque</strong>. Inverter qualquer etapa quebra a segurança.
      </AlertBox>

      <h2>Criando um middleware como classe</h2>
      <p>
        Lambdas funcionam para coisas simples. Para lógica reutilizável (com dependências injetadas, configuração, testes), crie uma classe:
      </p>
      <pre><code>{`public class TempoRespostaMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TempoRespostaMiddleware> _log;

    public TempoRespostaMiddleware(
        RequestDelegate next,
        ILogger<TempoRespostaMiddleware> log)
    {
        _next = next;
        _log = log;
    }

    // Convenção: método chamado "Invoke" ou "InvokeAsync"
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        await _next(context);                         // próximo da fila
        sw.Stop();
        _log.LogInformation("{Method} {Path} demorou {Ms}ms",
            context.Request.Method,
            context.Request.Path,
            sw.ElapsedMilliseconds);
    }
}

// Extensão fluente, opcional mas comum
public static class TempoRespostaExtensions
{
    public static IApplicationBuilder UseTempoResposta(
        this IApplicationBuilder app)
        => app.UseMiddleware<TempoRespostaMiddleware>();
}`}</code></pre>
      <pre><code>{`// Em Program.cs
app.UseTempoResposta();      // ou: app.UseMiddleware<TempoRespostaMiddleware>();`}</code></pre>
      <p>
        O construtor recebe dependências do container DI uma única vez (o middleware é <em>singleton</em> por padrão). Para dependências <em>scoped</em> (uma por requisição), declare-as no método <code>InvokeAsync</code> em vez do construtor.
      </p>

      <h2>Curto-circuito: respondendo sem chamar <code>next</code></h2>
      <p>
        Um middleware pode encerrar o pipeline antes da hora — útil para rate limiting, manutenção, redirecionamento:
      </p>
      <pre><code>{`app.Use(async (ctx, next) =>
{
    if (EstaEmManutencao())
    {
        ctx.Response.StatusCode = 503;
        await ctx.Response.WriteAsync("Voltamos em 5 min");
        return; // NÃO chama next → restante do pipeline não roda
    }
    await next();
});`}</code></pre>

      <h2>Tratamento de erros centralizado</h2>
      <p>
        O middleware <code>UseExceptionHandler</code> intercepta qualquer exceção lançada nos middlewares seguintes e encaminha para uma rota de erro:
      </p>
      <pre><code>{`if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();  // página detalhada com stack trace
}
else
{
    app.UseExceptionHandler("/erro"); // página amigável
    app.UseHsts();
}`}</code></pre>

      <AlertBox type="info" title="Inspecione com middleware">
        Adicione um <code>app.Use(async (ctx, next) =&gt; {`{ Console.WriteLine(ctx.Request.Path); await next(); }`})</code> bem no início do pipeline para confirmar que sua requisição realmente chegou. É um diagnóstico de 3 segundos que economiza horas.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>await next()</code>:</strong> a requisição morre sem nunca chegar nos endpoints.</li>
        <li><strong>Modificar headers DEPOIS de iniciar a resposta:</strong> escrever no body fecha os headers; tentar mudá-los lança exceção.</li>
        <li><strong>Injetar serviços scoped no construtor</strong> de um middleware — vira "captive dependency", o serviço fica preso à vida da aplicação.</li>
        <li><strong>Não chamar <code>UseRouting()</code></strong> antes de <code>UseCors()</code>/<code>UseAuthorization()</code> em apps complexos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>O pipeline ASP.NET Core é uma fila de middlewares no estilo "boneca russa".</li>
        <li><code>Use</code> = middleware encadeado; <code>Run</code> = terminal; <code>Map</code> = sub-pipeline por prefixo.</li>
        <li>A <strong>ordem</strong> de registro define o comportamento — auth antes de authz, CORS depois de routing.</li>
        <li>Middleware como classe usa <code>InvokeAsync(HttpContext)</code> e recebe <code>RequestDelegate next</code>.</li>
        <li>Não chamar <code>next</code> "curto-circuita" o pipeline — útil para rate limit, manutenção.</li>
        <li><code>UseExceptionHandler</code> centraliza o tratamento de erros não previstos.</li>
      </ul>
    </PageContainer>
  );
}
