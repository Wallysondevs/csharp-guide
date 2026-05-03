import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MediatorCqrs() {
  return (
    <PageContainer
      title="Mediator e CQRS com MediatR"
      subtitle="Separe leituras de escritas e organize a aplicação em handlers pequenos e testáveis."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <p>
        Conforme uma aplicação cresce, controllers viram "Deus": cada método tem 50 linhas, chama 5 serviços, mistura validação com regra de negócio com persistência. O padrão <strong>Mediator</strong>, popularizado em .NET pela biblioteca <strong>MediatR</strong>, propõe que cada caso de uso vire uma classe pequena com um único método. O controller só "envia" um objeto de requisição e o mediador descobre quem responde — como um carteiro que não conhece o destinatário, só a casa. Em paralelo, <strong>CQRS</strong> (Command Query Responsibility Segregation) diz: separe quem escreve (commands) de quem lê (queries) — eles têm necessidades diferentes.
      </p>

      <h2>Instalação</h2>
      <pre><code>{`# .NET 8/9 — MediatR a partir da v12 é pago para uso comercial.
# Alternativas free: MediatR <= 11.0, MassTransit Mediator, Mediator (martinothamar/Mediator)
dotnet add package MediatR

# No Program.cs:
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));`}</code></pre>

      <h2>Anatomia de uma Query</h2>
      <p>
        Uma <em>query</em> apenas lê dados — nunca altera estado. Ela tem um <strong>request</strong> (entrada) e um <strong>handler</strong> (quem processa).
      </p>
      <pre><code>{`// 1) A requisição: um simples DTO que implementa IRequest<TResposta>
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
}`}</code></pre>
      <p>
        O controller virou trivial. Toda a lógica está no handler — uma classe pequena, com uma responsabilidade clara, fácil de testar isoladamente (passe um <code>DbContext</code> em memória, instancie o handler, chame <code>Handle</code>).
      </p>

      <h2>Anatomia de um Command</h2>
      <p>
        Um <em>command</em> altera estado. Geralmente retorna pouco (Id criado, void) ou nada — porque a "resposta" interessa pouco; o que importa é que a mudança aconteceu.
      </p>
      <pre><code>{`public record CriarTarefaCommand(string Titulo) : IRequest<int>;

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
}`}</code></pre>

      <AlertBox type="info" title="CQRS sem dois bancos">
        Muitos confundem CQRS com "ter dois bancos: um para leitura, outro para escrita". Isso é a versão extrema (com event sourcing). A versão pragmática — chamada às vezes de "CQRS-lite" — apenas separa <em>classes</em> de comando e query no mesmo banco. É um ganho enorme de organização sem complexidade operacional.
      </AlertBox>

      <h2>Pipeline behaviors: o cherry on top</h2>
      <p>
        O grande motivo para usar MediatR <em>em vez de</em> apenas extrair handlers são os <strong>pipeline behaviors</strong>: middlewares que se aplicam a todos os requests de forma transparente. Logging, validação, transação, cache — tudo configurado uma vez.
      </p>
      <pre><code>{`// Behavior de validação com FluentValidation
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
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);`}</code></pre>
      <p>
        A ordem dos <code>AddTransient</code> define a ordem de execução: primeiro registrado é o "mais externo". Logging por fora, validação por dentro — assim mesmo requests que falham na validação aparecem nos logs.
      </p>

      <h2>Notifications: pub/sub interno</h2>
      <p>
        Além de <code>IRequest</code>, MediatR tem <code>INotification</code>: um evento que pode ter <em>vários</em> handlers, todos executados (em paralelo, por padrão). Útil para "side effects" desacoplados — quando uma tarefa é criada, queremos enviar e-mail, atualizar cache e gravar audit log.
      </p>
      <pre><code>{`public record TarefaCriada(int Id, string Titulo) : INotification;

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
await mediator.Publish(new TarefaCriada(t.Id, t.Titulo), ct);`}</code></pre>

      <AlertBox type="warning" title="MediatR não é grátis">
        Cada Send adiciona uma chamada com reflexão. Para a maioria das APIs, o impacto é desprezível. Mas, em código <em>hot path</em> (milhares de chamadas/seg), pode aparecer no perfil. Em projetos pequenos (CRUD com 4 endpoints), MediatR adiciona arquivos sem benefício real — controllers diretos são mais claros.
      </AlertBox>

      <h2>Vantagens e custos</h2>
      <p>
        <strong>Vantagens</strong>: cada caso de uso é uma classe pequena (fácil de ler, testar e mover); pipeline behaviors centralizam preocupações transversais; o controller fica anêmico (bom — ele é só transporte HTTP); novos requisitos nascem como classes novas, não como if novos. <strong>Custos</strong>: muitos arquivos pequenos podem cansar a navegação; quem chega ao código precisa entender o pipeline; debugging com stack trace ficam mais profundos.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Misturar lógica de banco no controller</strong> e ainda usar MediatR — pior dos dois mundos.</li>
        <li><strong>Handlers gigantes</strong> que fazem 5 coisas — quebre em pequenos.</li>
        <li><strong>Esquecer <code>RegisterServicesFromAssembly</code></strong> — handlers ficam não registrados; <code>Send</code> lança "Handler not found".</li>
        <li><strong>Notifications com handlers que dependem da ordem</strong> — eles rodam em paralelo; não suponha sequência.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Mediator separa o "pedir" do "fazer" — controllers ficam minimalistas.</li>
        <li>CQRS divide commands (escritas) de queries (leituras).</li>
        <li>Pipeline behaviors centralizam validação, log, transação, cache.</li>
        <li>Notifications viabilizam pub/sub interno desacoplado.</li>
        <li>Use em projetos médios/grandes; em CRUDs simples, é overkill.</li>
      </ul>
    </PageContainer>
  );
}
