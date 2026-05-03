import{j as e}from"./index-CzLAthD5.js";import{P as o,A as a}from"./AlertBox-CWJo3ar5.js";function r(){return e.jsxs(o,{title:"Middleware: o pipeline de requisições",subtitle:"Entenda como o ASP.NET Core processa cada requisição em camadas e como criar suas próprias camadas customizadas.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine uma fábrica de automóveis: o chassi entra de um lado da esteira e, ao longo dela, várias estações fazem operações específicas — pintura, instalação do motor, revisão final. No ASP.NET Core, cada requisição HTTP percorre uma esteira parecida, chamada de ",e.jsx("strong",{children:"pipeline"}),". Cada estação é um ",e.jsx("strong",{children:"middleware"}),": um trechinho de código que pode inspecionar a requisição, modificá-la, decidir se passa adiante ou se já devolve uma resposta. Entender esse pipeline é fundamental — é onde mora autenticação, CORS, logging, compressão e tratamento de erros."]}),e.jsx("h2",{children:"O que é um middleware, tecnicamente"}),e.jsxs("p",{children:["Um middleware é qualquer função (ou classe) que recebe um ",e.jsx("strong",{children:"HttpContext"})," (objeto com a requisição atual e a resposta sendo construída) e um ",e.jsx("strong",{children:"RequestDelegate next"})," — uma referência para o próximo middleware da fila. Ele faz seu trabalho, chama (ou não) ",e.jsx("code",{children:"next(context)"}),", e pode rodar mais código depois que ",e.jsx("code",{children:"next"})," retorna."]}),e.jsx("pre",{children:e.jsx("code",{children:`var app = builder.Build();

app.Use(async (context, next) =>
{
    // Antes de passar para o próximo middleware
    Console.WriteLine($"--> {context.Request.Method} {context.Request.Path}");

    await next(context);   // chama o próximo da fila

    // Depois que toda a cadeia respondeu
    Console.WriteLine($"<-- {context.Response.StatusCode}");
});

app.MapGet("/", () => "Olá!");

app.Run();`})}),e.jsxs("p",{children:['Esse padrão é chamado de "Russian doll" (boneca russa): cada middleware envolve a chamada do próximo. Você pode pular o ',e.jsx("code",{children:"await next()"}),' para "curtir-circuitar" o pipeline e devolver imediatamente.']}),e.jsx("h2",{children:"Os três métodos: Use, Run e Map"}),e.jsx("p",{children:"O ASP.NET oferece três jeitos de adicionar coisas ao pipeline:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"app.Use(...)"}),": middleware que pode passar adiante (chama ",e.jsx("code",{children:"next"}),")."]}),e.jsxs("li",{children:[e.jsx("code",{children:"app.Run(...)"}),": middleware ",e.jsx("em",{children:"terminal"})," — encerra a cadeia, sem chamar próximo. Geralmente fica no fim."]}),e.jsxs("li",{children:[e.jsx("code",{children:'app.Map("/admin", ...)'}),': cria uma "subesteira" que só processa requisições com o prefixo dado.']})]}),e.jsx("pre",{children:e.jsx("code",{children:`app.Map("/admin", adminApp =>
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
});`})}),e.jsx("h2",{children:"A ORDEM IMPORTA — muito"}),e.jsx("p",{children:"Como cada middleware envolve o próximo, a sequência em que você os registra é o que define o comportamento da aplicação. A documentação oficial recomenda essa ordem para um app típico:"}),e.jsx("pre",{children:e.jsx("code",{children:`var app = builder.Build();

app.UseExceptionHandler("/erro");   // 1. Captura exceções
app.UseHttpsRedirection();          // 2. Força HTTPS
app.UseStaticFiles();               // 3. Serve wwwroot/
app.UseRouting();                   // 4. Decide qual endpoint vai responder
app.UseCors();                      // 5. CORS (depois de Routing!)
app.UseAuthentication();            // 6. "Quem é você?"
app.UseAuthorization();             // 7. "Você pode entrar aqui?"
app.MapControllers();               // 8. Executa o endpoint
app.Run();`})}),e.jsxs("p",{children:["Errar essa ordem causa bugs sutis: ",e.jsx("code",{children:"UseAuthorization"})," antes de ",e.jsx("code",{children:"UseAuthentication"})," deixa todos como anônimos; ",e.jsx("code",{children:"UseStaticFiles"})," depois de autenticação obriga login para baixar o CSS; ",e.jsx("code",{children:"UseCors"})," antes de ",e.jsx("code",{children:"UseRouting"})," não funciona corretamente."]}),e.jsxs(a,{type:"warning",title:"A regra de ouro",children:["Pense no pipeline como filas em um aeroporto: ",e.jsx("strong",{children:"identificação"})," antes de ",e.jsx("strong",{children:"controle de acesso"}),"; ",e.jsx("strong",{children:"raio-x"})," antes do ",e.jsx("strong",{children:"portão de embarque"}),". Inverter qualquer etapa quebra a segurança."]}),e.jsx("h2",{children:"Criando um middleware como classe"}),e.jsx("p",{children:"Lambdas funcionam para coisas simples. Para lógica reutilizável (com dependências injetadas, configuração, testes), crie uma classe:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class TempoRespostaMiddleware
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
}`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Em Program.cs
app.UseTempoResposta();      // ou: app.UseMiddleware<TempoRespostaMiddleware>();`})}),e.jsxs("p",{children:["O construtor recebe dependências do container DI uma única vez (o middleware é ",e.jsx("em",{children:"singleton"})," por padrão). Para dependências ",e.jsx("em",{children:"scoped"})," (uma por requisição), declare-as no método ",e.jsx("code",{children:"InvokeAsync"})," em vez do construtor."]}),e.jsxs("h2",{children:["Curto-circuito: respondendo sem chamar ",e.jsx("code",{children:"next"})]}),e.jsx("p",{children:"Um middleware pode encerrar o pipeline antes da hora — útil para rate limiting, manutenção, redirecionamento:"}),e.jsx("pre",{children:e.jsx("code",{children:`app.Use(async (ctx, next) =>
{
    if (EstaEmManutencao())
    {
        ctx.Response.StatusCode = 503;
        await ctx.Response.WriteAsync("Voltamos em 5 min");
        return; // NÃO chama next → restante do pipeline não roda
    }
    await next();
});`})}),e.jsx("h2",{children:"Tratamento de erros centralizado"}),e.jsxs("p",{children:["O middleware ",e.jsx("code",{children:"UseExceptionHandler"})," intercepta qualquer exceção lançada nos middlewares seguintes e encaminha para uma rota de erro:"]}),e.jsx("pre",{children:e.jsx("code",{children:`if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();  // página detalhada com stack trace
}
else
{
    app.UseExceptionHandler("/erro"); // página amigável
    app.UseHsts();
}`})}),e.jsxs(a,{type:"info",title:"Inspecione com middleware",children:["Adicione um ",e.jsxs("code",{children:["app.Use(async (ctx, next) => ","{ Console.WriteLine(ctx.Request.Path); await next(); }",")"]})," bem no início do pipeline para confirmar que sua requisição realmente chegou. É um diagnóstico de 3 segundos que economiza horas."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"await next()"}),":"]})," a requisição morre sem nunca chegar nos endpoints."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Modificar headers DEPOIS de iniciar a resposta:"})," escrever no body fecha os headers; tentar mudá-los lança exceção."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Injetar serviços scoped no construtor"}),' de um middleware — vira "captive dependency", o serviço fica preso à vida da aplicação.']}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não chamar ",e.jsx("code",{children:"UseRouting()"})]})," antes de ",e.jsx("code",{children:"UseCors()"}),"/",e.jsx("code",{children:"UseAuthorization()"})," em apps complexos."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:'O pipeline ASP.NET Core é uma fila de middlewares no estilo "boneca russa".'}),e.jsxs("li",{children:[e.jsx("code",{children:"Use"})," = middleware encadeado; ",e.jsx("code",{children:"Run"})," = terminal; ",e.jsx("code",{children:"Map"})," = sub-pipeline por prefixo."]}),e.jsxs("li",{children:["A ",e.jsx("strong",{children:"ordem"})," de registro define o comportamento — auth antes de authz, CORS depois de routing."]}),e.jsxs("li",{children:["Middleware como classe usa ",e.jsx("code",{children:"InvokeAsync(HttpContext)"})," e recebe ",e.jsx("code",{children:"RequestDelegate next"}),"."]}),e.jsxs("li",{children:["Não chamar ",e.jsx("code",{children:"next"}),' "curto-circuita" o pipeline — útil para rate limit, manutenção.']}),e.jsxs("li",{children:[e.jsx("code",{children:"UseExceptionHandler"})," centraliza o tratamento de erros não previstos."]})]})]})}export{r as default};
