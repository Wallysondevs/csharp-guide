import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DependencyInjection() {
  return (
    <PageContainer
      title="Dependency Injection nativo do ASP.NET Core"
      subtitle="Aprenda como o ASP.NET monta e entrega objetos para você automaticamente — e por que isso muda completamente a maneira de escrever código testável."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine que você está montando um carro. Você poderia, dentro do motor, criar uma fábrica de pneus, soldar um chassi e fundir alumínio para o capô. Mas seria absurdo — você quer encaixar peças <em>já prontas</em>. Em programação, fazer um objeto criar suas próprias dependências (com <code>new</code> espalhados em todo lugar) gera o mesmo problema: acoplamento alto, difícil de testar, difícil de trocar implementações. <strong>Injeção de dependência</strong> (DI) inverte isso: alguém de fora monta as peças e as entrega para você. O ASP.NET Core já vem com um container de DI embutido — usá-lo bem é metade do trabalho de escrever um app limpo.
      </p>

      <h2>O conceito em uma analogia</h2>
      <p>
        Sem DI, sua classe é como um chef que vai pessoalmente à fazenda colher tomate sempre que precisa fazer molho. Com DI, alguém entrega os tomates já lavados na cozinha. O chef cozinha, ponto. Se amanhã você quer testar a receita com tomate de plástico (mock), basta entregar o tomate fake — o chef nem percebe a troca.
      </p>

      <h2>Registrando serviços</h2>
      <p>
        No <code>Program.cs</code>, você "ensina" ao container quais classes ele deve saber criar. Isso se chama <strong>registrar um serviço</strong>. Existem três tempos de vida (<em>lifetimes</em>) possíveis:
      </p>
      <pre><code>{`var builder = WebApplication.CreateBuilder(args);

// Singleton: 1 instância para a vida inteira do app
builder.Services.AddSingleton<IRelogio, RelogioSistema>();

// Scoped: 1 instância por requisição HTTP
builder.Services.AddScoped<IPedidoRepository, PedidoRepositoryEf>();

// Transient: 1 instância nova a CADA pedido (sempre)
builder.Services.AddTransient<IEmailEnviador, SmtpEmailEnviador>();`}</code></pre>
      <p>
        A sintaxe <code>AddScoped&lt;Interface, Implementacao&gt;()</code> diz: "quando alguém pedir <code>IPedidoRepository</code>, entregue uma instância de <code>PedidoRepositoryEf</code>". Isso permite trocar a implementação sem mexer no resto do código (princípio da inversão de dependência — o "D" do SOLID).
      </p>

      <h2>Os três lifetimes em detalhe</h2>
      <ul>
        <li><strong>Singleton</strong> — UMA instância para sempre. Use para serviços sem estado mutável (loggers, caches, config). Cuidado: se for compartilhado entre threads, precisa ser thread-safe.</li>
        <li><strong>Scoped</strong> — UMA instância por requisição HTTP. Padrão para repositórios e DbContext do Entity Framework, porque cada requisição precisa de sua própria conexão/transação.</li>
        <li><strong>Transient</strong> — UMA instância nova a cada injeção. Use para serviços leves e sem estado, ou que mantêm estado por chamada (validators, calculadoras).</li>
      </ul>
      <pre><code>{`// Demonstração: cada serviço gera um GUID no construtor
public class TesteController : ControllerBase
{
    public TesteController(
        ISingleton s1, ISingleton s2,
        IScoped sc1, IScoped sc2,
        ITransient t1, ITransient t2)
    {
        Console.WriteLine($"Singleton: {s1.Id == s2.Id}"); // True sempre
        Console.WriteLine($"Scoped:    {sc1.Id == sc2.Id}");// True dentro da request
        Console.WriteLine($"Transient: {t1.Id == t2.Id}"); // False sempre
    }
}`}</code></pre>

      <h2>Injetando via construtor</h2>
      <p>
        A maneira idiomática de receber dependências é declará-las como parâmetros do <strong>construtor</strong>. O ASP.NET resolve a árvore de dependências automaticamente — se a classe precisa de A, e A precisa de B, ele cria B, depois A, e por fim a sua classe.
      </p>
      <pre><code>{`public interface IPedidoService
{
    Task<Pedido> CriarAsync(NovoPedidoDto dto);
}

public class PedidoService : IPedidoService
{
    private readonly IPedidoRepository _repo;
    private readonly IEmailEnviador _email;
    private readonly ILogger<PedidoService> _log;

    // Tudo é injetado pelo container
    public PedidoService(
        IPedidoRepository repo,
        IEmailEnviador email,
        ILogger<PedidoService> log)
    {
        _repo = repo;
        _email = email;
        _log = log;
    }

    public async Task<Pedido> CriarAsync(NovoPedidoDto dto)
    {
        var pedido = await _repo.SalvarAsync(new Pedido(dto));
        await _email.EnviarAsync(pedido.EmailCliente, "Pedido confirmado");
        _log.LogInformation("Pedido {Id} criado", pedido.Id);
        return pedido;
    }
}

// Em Program.cs
builder.Services.AddScoped<IPedidoService, PedidoService>();`}</code></pre>

      <h2>Padrões alternativos: Action, Factory, Multi-registration</h2>
      <p>
        Às vezes a criação envolve lógica (ler config, escolher implementação dinâmica). Aí você usa um <em>factory delegate</em>:
      </p>
      <pre><code>{`builder.Services.AddSingleton<IRelogio>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return config["Ambiente"] == "Teste"
        ? new RelogioFake()
        : new RelogioSistema();
});

// Várias implementações para a mesma interface
builder.Services.AddScoped<INotificador, NotificadorEmail>();
builder.Services.AddScoped<INotificador, NotificadorSms>();
builder.Services.AddScoped<INotificador, NotificadorPush>();

// Em outro serviço, receba TODAS:
public class Notificacoes(IEnumerable<INotificador> notificadores)
{
    public Task EnviarTodas(string msg)
        => Task.WhenAll(notificadores.Select(n => n.Enviar(msg)));
}`}</code></pre>
      <p>
        O <code>IServiceProvider sp</code> dado ao factory permite resolver outros serviços manualmente. Em apps grandes, esse padrão é útil para configurar SDKs externos.
      </p>

      <AlertBox type="warning" title="Captive dependency: o pecado clássico">
        Se você injeta um serviço <strong>Scoped</strong> dentro de um <strong>Singleton</strong>, o Singleton vai segurar essa instância para SEMPRE — bem além do tempo de vida que ela deveria ter. Resultado: o Scoped fica "preso" e não é descartado, gerando vazamento de memória, conexões zumbis ou bugs sutis. O ASP.NET detecta isso em desenvolvimento e lança exceção; nunca ignore esse erro.
      </AlertBox>

      <h2>Resolvendo serviços manualmente</h2>
      <p>
        Em raros casos (ex.: dentro de um background job), você precisa pedir um serviço fora do construtor. Use <code>IServiceScopeFactory</code> para criar um scope manualmente:
      </p>
      <pre><code>{`public class ProcessadorBackground(IServiceScopeFactory scopeFactory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            // Cria um scope novo a cada iteração
            using var scope = scopeFactory.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IPedidoRepository>();
            await repo.ProcessarPendentesAsync();

            await Task.Delay(TimeSpan.FromMinutes(1), ct);
        }
    }
}`}</code></pre>

      <h2>Keyed services (.NET 8+)</h2>
      <p>
        Desde o .NET 8, o container suporta serviços identificados por chave — útil quando há várias implementações da mesma interface:
      </p>
      <pre><code>{`builder.Services.AddKeyedScoped<INotificador, NotificadorEmail>("email");
builder.Services.AddKeyedScoped<INotificador, NotificadorSms>("sms");

public class FluxoPedido(
    [FromKeyedServices("email")] INotificador email,
    [FromKeyedServices("sms")] INotificador sms)
{
    // ...
}`}</code></pre>

      <AlertBox type="info" title="Por que tudo isso importa?">
        DI permite trocar implementações em testes (mock de banco, mock de email), substituir bibliotecas sem reescrever consumidores e configurar comportamento por ambiente (dev, staging, prod). É a base do desenvolvimento testável e modular em .NET.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Captive dependency:</strong> injetar Scoped em Singleton (ou Transient em Singleton, sem cuidado).</li>
        <li><strong>Esquecer de registrar:</strong> erro <em>"Unable to resolve service for type X"</em> em runtime.</li>
        <li><strong>Service Locator anti-pattern:</strong> injetar <code>IServiceProvider</code> em todo lugar e resolver tipos manualmente — perde toda a clareza do construtor.</li>
        <li><strong>Construtores enormes:</strong> 8+ parâmetros é cheiro de classe que faz coisas demais — quebre em serviços menores.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>DI inverte a responsabilidade de criar dependências — alguém de fora as entrega prontas.</li>
        <li>ASP.NET Core inclui um container nativo, configurado em <code>builder.Services</code>.</li>
        <li>Três lifetimes: <strong>Singleton</strong>, <strong>Scoped</strong> (por requisição) e <strong>Transient</strong>.</li>
        <li>Construtor é o canal idiomático de injeção; factories e keyed services cobrem casos especiais.</li>
        <li>Cuidado com <em>captive dependency</em>: nunca injete Scoped em Singleton.</li>
        <li>DI é o que torna o código testável e configurável por ambiente.</li>
      </ul>
    </PageContainer>
  );
}
