import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function a(){return e.jsxs(r,{title:"Dependency Injection nativo do ASP.NET Core",subtitle:"Aprenda como o ASP.NET monta e entrega objetos para você automaticamente — e por que isso muda completamente a maneira de escrever código testável.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:["Imagine que você está montando um carro. Você poderia, dentro do motor, criar uma fábrica de pneus, soldar um chassi e fundir alumínio para o capô. Mas seria absurdo — você quer encaixar peças ",e.jsx("em",{children:"já prontas"}),". Em programação, fazer um objeto criar suas próprias dependências (com ",e.jsx("code",{children:"new"})," espalhados em todo lugar) gera o mesmo problema: acoplamento alto, difícil de testar, difícil de trocar implementações. ",e.jsx("strong",{children:"Injeção de dependência"})," (DI) inverte isso: alguém de fora monta as peças e as entrega para você. O ASP.NET Core já vem com um container de DI embutido — usá-lo bem é metade do trabalho de escrever um app limpo."]}),e.jsx("h2",{children:"O conceito em uma analogia"}),e.jsx("p",{children:"Sem DI, sua classe é como um chef que vai pessoalmente à fazenda colher tomate sempre que precisa fazer molho. Com DI, alguém entrega os tomates já lavados na cozinha. O chef cozinha, ponto. Se amanhã você quer testar a receita com tomate de plástico (mock), basta entregar o tomate fake — o chef nem percebe a troca."}),e.jsx("h2",{children:"Registrando serviços"}),e.jsxs("p",{children:["No ",e.jsx("code",{children:"Program.cs"}),', você "ensina" ao container quais classes ele deve saber criar. Isso se chama ',e.jsx("strong",{children:"registrar um serviço"}),". Existem três tempos de vida (",e.jsx("em",{children:"lifetimes"}),") possíveis:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var builder = WebApplication.CreateBuilder(args);

// Singleton: 1 instância para a vida inteira do app
builder.Services.AddSingleton<IRelogio, RelogioSistema>();

// Scoped: 1 instância por requisição HTTP
builder.Services.AddScoped<IPedidoRepository, PedidoRepositoryEf>();

// Transient: 1 instância nova a CADA pedido (sempre)
builder.Services.AddTransient<IEmailEnviador, SmtpEmailEnviador>();`})}),e.jsxs("p",{children:["A sintaxe ",e.jsx("code",{children:"AddScoped<Interface, Implementacao>()"}),' diz: "quando alguém pedir ',e.jsx("code",{children:"IPedidoRepository"}),", entregue uma instância de ",e.jsx("code",{children:"PedidoRepositoryEf"}),'". Isso permite trocar a implementação sem mexer no resto do código (princípio da inversão de dependência — o "D" do SOLID).']}),e.jsx("h2",{children:"Os três lifetimes em detalhe"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Singleton"})," — UMA instância para sempre. Use para serviços sem estado mutável (loggers, caches, config). Cuidado: se for compartilhado entre threads, precisa ser thread-safe."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Scoped"})," — UMA instância por requisição HTTP. Padrão para repositórios e DbContext do Entity Framework, porque cada requisição precisa de sua própria conexão/transação."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Transient"})," — UMA instância nova a cada injeção. Use para serviços leves e sem estado, ou que mantêm estado por chamada (validators, calculadoras)."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`// Demonstração: cada serviço gera um GUID no construtor
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
}`})}),e.jsx("h2",{children:"Injetando via construtor"}),e.jsxs("p",{children:["A maneira idiomática de receber dependências é declará-las como parâmetros do ",e.jsx("strong",{children:"construtor"}),". O ASP.NET resolve a árvore de dependências automaticamente — se a classe precisa de A, e A precisa de B, ele cria B, depois A, e por fim a sua classe."]}),e.jsx("pre",{children:e.jsx("code",{children:`public interface IPedidoService
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
builder.Services.AddScoped<IPedidoService, PedidoService>();`})}),e.jsx("h2",{children:"Padrões alternativos: Action, Factory, Multi-registration"}),e.jsxs("p",{children:["Às vezes a criação envolve lógica (ler config, escolher implementação dinâmica). Aí você usa um ",e.jsx("em",{children:"factory delegate"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Services.AddSingleton<IRelogio>(sp =>
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
}`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"IServiceProvider sp"})," dado ao factory permite resolver outros serviços manualmente. Em apps grandes, esse padrão é útil para configurar SDKs externos."]}),e.jsxs(o,{type:"warning",title:"Captive dependency: o pecado clássico",children:["Se você injeta um serviço ",e.jsx("strong",{children:"Scoped"})," dentro de um ",e.jsx("strong",{children:"Singleton"}),', o Singleton vai segurar essa instância para SEMPRE — bem além do tempo de vida que ela deveria ter. Resultado: o Scoped fica "preso" e não é descartado, gerando vazamento de memória, conexões zumbis ou bugs sutis. O ASP.NET detecta isso em desenvolvimento e lança exceção; nunca ignore esse erro.']}),e.jsx("h2",{children:"Resolvendo serviços manualmente"}),e.jsxs("p",{children:["Em raros casos (ex.: dentro de um background job), você precisa pedir um serviço fora do construtor. Use ",e.jsx("code",{children:"IServiceScopeFactory"})," para criar um scope manualmente:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class ProcessadorBackground(IServiceScopeFactory scopeFactory) : BackgroundService
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
}`})}),e.jsx("h2",{children:"Keyed services (.NET 8+)"}),e.jsx("p",{children:"Desde o .NET 8, o container suporta serviços identificados por chave — útil quando há várias implementações da mesma interface:"}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Services.AddKeyedScoped<INotificador, NotificadorEmail>("email");
builder.Services.AddKeyedScoped<INotificador, NotificadorSms>("sms");

public class FluxoPedido(
    [FromKeyedServices("email")] INotificador email,
    [FromKeyedServices("sms")] INotificador sms)
{
    // ...
}`})}),e.jsx(o,{type:"info",title:"Por que tudo isso importa?",children:"DI permite trocar implementações em testes (mock de banco, mock de email), substituir bibliotecas sem reescrever consumidores e configurar comportamento por ambiente (dev, staging, prod). É a base do desenvolvimento testável e modular em .NET."}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Captive dependency:"})," injetar Scoped em Singleton (ou Transient em Singleton, sem cuidado)."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de registrar:"})," erro ",e.jsx("em",{children:'"Unable to resolve service for type X"'})," em runtime."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Service Locator anti-pattern:"})," injetar ",e.jsx("code",{children:"IServiceProvider"})," em todo lugar e resolver tipos manualmente — perde toda a clareza do construtor."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Construtores enormes:"})," 8+ parâmetros é cheiro de classe que faz coisas demais — quebre em serviços menores."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"DI inverte a responsabilidade de criar dependências — alguém de fora as entrega prontas."}),e.jsxs("li",{children:["ASP.NET Core inclui um container nativo, configurado em ",e.jsx("code",{children:"builder.Services"}),"."]}),e.jsxs("li",{children:["Três lifetimes: ",e.jsx("strong",{children:"Singleton"}),", ",e.jsx("strong",{children:"Scoped"})," (por requisição) e ",e.jsx("strong",{children:"Transient"}),"."]}),e.jsx("li",{children:"Construtor é o canal idiomático de injeção; factories e keyed services cobrem casos especiais."}),e.jsxs("li",{children:["Cuidado com ",e.jsx("em",{children:"captive dependency"}),": nunca injete Scoped em Singleton."]}),e.jsx("li",{children:"DI é o que torna o código testável e configurável por ambiente."})]})]})}export{a as default};
