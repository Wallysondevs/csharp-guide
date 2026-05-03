import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Mediator e CQRS com MediatR",subtitle:"Separe leituras de escritas e organize a aplicação em handlers pequenos e testáveis.",difficulty:"avancado",timeToRead:"18 min",children:[e.jsxs("p",{children:['Conforme uma aplicação cresce, controllers viram "Deus": cada método tem 50 linhas, chama 5 serviços, mistura validação com regra de negócio com persistência. O padrão ',e.jsx("strong",{children:"Mediator"}),", popularizado em .NET pela biblioteca ",e.jsx("strong",{children:"MediatR"}),', propõe que cada caso de uso vire uma classe pequena com um único método. O controller só "envia" um objeto de requisição e o mediador descobre quem responde — como um carteiro que não conhece o destinatário, só a casa. Em paralelo, ',e.jsx("strong",{children:"CQRS"})," (Command Query Responsibility Segregation) diz: separe quem escreve (commands) de quem lê (queries) — eles têm necessidades diferentes."]}),e.jsx("h2",{children:"Instalação"}),e.jsx("pre",{children:e.jsx("code",{children:`# .NET 8/9 — MediatR a partir da v12 é pago para uso comercial.
# Alternativas free: MediatR <= 11.0, MassTransit Mediator, Mediator (martinothamar/Mediator)
dotnet add package MediatR

# No Program.cs:
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));`})}),e.jsx("h2",{children:"Anatomia de uma Query"}),e.jsxs("p",{children:["Uma ",e.jsx("em",{children:"query"})," apenas lê dados — nunca altera estado. Ela tem um ",e.jsx("strong",{children:"request"})," (entrada) e um ",e.jsx("strong",{children:"handler"})," (quem processa)."]}),e.jsx("pre",{children:e.jsx("code",{children:`// 1) A requisição: um simples DTO que implementa IRequest<TResposta>
public record ObterTarefaQuery(int Id) : IRequest<TarefaDto?>;

// 2) O handler
public class ObterTarefaHandler : IRequestHandler<ObterTarefaQuery, TarefaDto?>
{
    private readonly AppDbContext _ctx;
    public ObterTarefaHandler(AppDbContext ctx) => _ctx = ctx;

    public async Task<TarefaDto?> Handle(ObterTarefaQuery req, CancellationToken ct)
    {
        return await _ctx.Tarefas
            .Where(t => t.Id == req.Id)
            .Select(t => new TarefaDto(t.Id, t.Titulo, t.Concluida))
            .FirstOrDefaultAsync(ct);
    }
}

// 3) Uso no controller
[HttpGet("{id}")]
public async Task<IActionResult> Obter(int id, ISender mediator)
{
    var dto = await mediator.Send(new ObterTarefaQuery(id));
    return dto is null ? NotFound() : Ok(dto);
}`})}),e.jsxs("p",{children:["O controller virou trivial. Toda a lógica está no handler — uma classe pequena, com uma responsabilidade clara, fácil de testar isoladamente (passe um ",e.jsx("code",{children:"DbContext"})," em memória, instancie o handler, chame ",e.jsx("code",{children:"Handle"}),")."]}),e.jsx("h2",{children:"Anatomia de um Command"}),e.jsxs("p",{children:["Um ",e.jsx("em",{children:"command"}),' altera estado. Geralmente retorna pouco (Id criado, void) ou nada — porque a "resposta" interessa pouco; o que importa é que a mudança aconteceu.']}),e.jsx("pre",{children:e.jsx("code",{children:`public record CriarTarefaCommand(string Titulo) : IRequest<int>;

public class CriarTarefaHandler : IRequestHandler<CriarTarefaCommand, int>
{
    private readonly AppDbContext _ctx;
    public CriarTarefaHandler(AppDbContext c) => _ctx = c;

    public async Task<int> Handle(CriarTarefaCommand req, CancellationToken ct)
    {
        var t = new Tarefa { Titulo = req.Titulo };
        _ctx.Tarefas.Add(t);
        await _ctx.SaveChangesAsync(ct);
        return t.Id;
    }
}`})}),e.jsxs(a,{type:"info",title:"CQRS sem dois bancos",children:['Muitos confundem CQRS com "ter dois bancos: um para leitura, outro para escrita". Isso é a versão extrema (com event sourcing). A versão pragmática — chamada às vezes de "CQRS-lite" — apenas separa ',e.jsx("em",{children:"classes"})," de comando e query no mesmo banco. É um ganho enorme de organização sem complexidade operacional."]}),e.jsx("h2",{children:"Pipeline behaviors: o cherry on top"}),e.jsxs("p",{children:["O grande motivo para usar MediatR ",e.jsx("em",{children:"em vez de"})," apenas extrair handlers são os ",e.jsx("strong",{children:"pipeline behaviors"}),": middlewares que se aplicam a todos os requests de forma transparente. Logging, validação, transação, cache — tudo configurado uma vez."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Behavior de validação com FluentValidation
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> v) => _validators = v;

    public async Task<TResponse> Handle(TRequest req,
        RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (_validators.Any())
        {
            var ctx = new ValidationContext<TRequest>(req);
            var falhas = (await Task.WhenAll(_validators.Select(v => v.ValidateAsync(ctx, ct))))
                .SelectMany(r => r.Errors)
                .Where(f => f != null)
                .ToList();
            if (falhas.Count > 0) throw new ValidationException(falhas);
        }
        return await next();
    }
}

// Behavior de logging
public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _log;
    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> l) => _log = l;

    public async Task<TResponse> Handle(TRequest r,
        RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        var sw = Stopwatch.StartNew();
        _log.LogInformation("Handling {Req}", typeof(TRequest).Name);
        var resp = await next();
        _log.LogInformation("{Req} done in {Ms}ms", typeof(TRequest).Name, sw.ElapsedMilliseconds);
        return resp;
    }
}

// Registro
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);`})}),e.jsxs("p",{children:["A ordem dos ",e.jsx("code",{children:"AddTransient"}),' define a ordem de execução: primeiro registrado é o "mais externo". Logging por fora, validação por dentro — assim mesmo requests que falham na validação aparecem nos logs.']}),e.jsx("h2",{children:"Notifications: pub/sub interno"}),e.jsxs("p",{children:["Além de ",e.jsx("code",{children:"IRequest"}),", MediatR tem ",e.jsx("code",{children:"INotification"}),": um evento que pode ter ",e.jsx("em",{children:"vários"}),' handlers, todos executados (em paralelo, por padrão). Útil para "side effects" desacoplados — quando uma tarefa é criada, queremos enviar e-mail, atualizar cache e gravar audit log.']}),e.jsx("pre",{children:e.jsx("code",{children:`public record TarefaCriada(int Id, string Titulo) : INotification;

public class EnviarEmailDeNovaTarefa : INotificationHandler<TarefaCriada>
{
    public Task Handle(TarefaCriada n, CancellationToken ct)
        => /* enviar e-mail */ Task.CompletedTask;
}

public class AtualizarCacheDeTarefas : INotificationHandler<TarefaCriada>
{
    public Task Handle(TarefaCriada n, CancellationToken ct)
        => /* invalidar cache */ Task.CompletedTask;
}

// Disparar:
await mediator.Publish(new TarefaCriada(t.Id, t.Titulo), ct);`})}),e.jsxs(a,{type:"warning",title:"MediatR não é grátis",children:["Cada Send adiciona uma chamada com reflexão. Para a maioria das APIs, o impacto é desprezível. Mas, em código ",e.jsx("em",{children:"hot path"})," (milhares de chamadas/seg), pode aparecer no perfil. Em projetos pequenos (CRUD com 4 endpoints), MediatR adiciona arquivos sem benefício real — controllers diretos são mais claros."]}),e.jsx("h2",{children:"Vantagens e custos"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Vantagens"}),": cada caso de uso é uma classe pequena (fácil de ler, testar e mover); pipeline behaviors centralizam preocupações transversais; o controller fica anêmico (bom — ele é só transporte HTTP); novos requisitos nascem como classes novas, não como if novos. ",e.jsx("strong",{children:"Custos"}),": muitos arquivos pequenos podem cansar a navegação; quem chega ao código precisa entender o pipeline; debugging com stack trace ficam mais profundos."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar lógica de banco no controller"})," e ainda usar MediatR — pior dos dois mundos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Handlers gigantes"})," que fazem 5 coisas — quebre em pequenos."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"RegisterServicesFromAssembly"})]})," — handlers ficam não registrados; ",e.jsx("code",{children:"Send"}),' lança "Handler not found".']}),e.jsxs("li",{children:[e.jsx("strong",{children:"Notifications com handlers que dependem da ordem"})," — eles rodam em paralelo; não suponha sequência."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:'Mediator separa o "pedir" do "fazer" — controllers ficam minimalistas.'}),e.jsx("li",{children:"CQRS divide commands (escritas) de queries (leituras)."}),e.jsx("li",{children:"Pipeline behaviors centralizam validação, log, transação, cache."}),e.jsx("li",{children:"Notifications viabilizam pub/sub interno desacoplado."}),e.jsx("li",{children:"Use em projetos médios/grandes; em CRUDs simples, é overkill."})]})]})}export{s as default};
