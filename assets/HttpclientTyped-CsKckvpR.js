import{j as e}from"./index-CzLAthD5.js";import{P as s,A as t}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(s,{title:"HttpClient: typed clients e IHttpClientFactory",subtitle:"A forma certa de fazer chamadas HTTP em .NET — sem socket exhaustion e com retry automático.",difficulty:"intermediario",timeToRead:"16 min",children:[e.jsxs("p",{children:[e.jsx("code",{children:"HttpClient"})," parece simples, mas é uma das classes mais traiçoeiras do .NET. Ela ",e.jsx("em",{children:"parece"})," que deveria ser usada como qualquer outra (",e.jsx("code",{children:"using var c = new HttpClient(); c.GetAsync(...)"}),"), mas isso causa um bug clássico: ",e.jsx("strong",{children:"socket exhaustion"}),". Cada novo HttpClient abre conexões TCP que demoram a fechar (ficam em estado ",e.jsx("em",{children:"TIME_WAIT"})," por minutos). Em um servidor com tráfego, você esgota as portas locais e tudo trava. A Microsoft corrigiu isso com o ",e.jsx("strong",{children:"IHttpClientFactory"}),'. Pense nele como uma "concessionária de carros": você não compra um carro novo a cada viagem; você pega um da frota, anda, devolve.']}),e.jsx("h2",{children:"O problema antigo"}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM — uso ingênuo
public async Task<string> Buscar()
{
    using var http = new HttpClient(); // CADA chamada abre conexões
    return await http.GetStringAsync("https://api.exemplo.com/dados");
}`})}),e.jsxs("p",{children:["Sob carga, esse código cria centenas de instâncias por segundo. As conexões TCP correspondentes ficam presas, a porta 49xxx esgota, novas chamadas falham com erros confusos como ",e.jsx("em",{children:'"SocketException: Only one usage of each socket address..."'}),"."]}),e.jsx("h2",{children:"IHttpClientFactory: o jeito certo"}),e.jsxs("p",{children:["A factory mantém um pool de ",e.jsx("code",{children:"HttpMessageHandler"})," reusados, com tempo de vida controlado (default 2 min). Você só pede instâncias dela; o pool resolve o resto."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
builder.Services.AddHttpClient(); // registra a factory

// Em qualquer serviço:
public class GitHubServico
{
    private readonly IHttpClientFactory _factory;
    public GitHubServico(IHttpClientFactory f) => _factory = f;

    public async Task<string> ObterReadmeAsync(string repo)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("User-Agent", "MeuApp/1.0");
        return await client.GetStringAsync($"https://api.github.com/repos/{repo}/readme");
    }
}`})}),e.jsx("h2",{children:"Named clients"}),e.jsx("p",{children:"Se você fala com várias APIs (cada uma com base URL e headers próprios), pode dar nomes:"}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Services.AddHttpClient("github", c =>
{
    c.BaseAddress = new Uri("https://api.github.com/");
    c.DefaultRequestHeaders.Add("User-Agent", "MeuApp/1.0");
    c.DefaultRequestHeaders.Add("Accept", "application/vnd.github+json");
});

builder.Services.AddHttpClient("stripe", c =>
{
    c.BaseAddress = new Uri("https://api.stripe.com/");
    c.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", builder.Configuration["Stripe:Key"]);
});

// Uso
var gh = factory.CreateClient("github");
var resp = await gh.GetAsync("repos/dotnet/core");`})}),e.jsx("h2",{children:"Typed clients (recomendado)"}),e.jsxs("p",{children:["Em vez de pedir um ",e.jsx("code",{children:"IHttpClientFactory"})," em todo lugar, você cria uma classe que recebe um ",e.jsx("code",{children:"HttpClient"})," já configurado. Fica tipado, testável e expressivo."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class GitHubClient
{
    private readonly HttpClient _http;
    public GitHubClient(HttpClient http) { _http = http; }

    public async Task<Repositorio?> ObterRepoAsync(string owner, string name)
    {
        // ReadFromJsonAsync (System.Net.Http.Json) deserializa direto
        return await _http.GetFromJsonAsync<Repositorio>($"repos/{owner}/{name}");
    }

    public async Task<HttpResponseMessage> CriarIssueAsync(string owner, string repo, NovaIssue dto)
    {
        return await _http.PostAsJsonAsync($"repos/{owner}/{repo}/issues", dto);
    }
}

public record Repositorio(int Id, string Name, string FullName, int StargazersCount);
public record NovaIssue(string Title, string Body);

// Registro: associa o tipo ao HttpClient
builder.Services.AddHttpClient<GitHubClient>(c =>
{
    c.BaseAddress = new Uri("https://api.github.com/");
    c.DefaultRequestHeaders.Add("User-Agent", "MeuApp/1.0");
});

// Uso em qualquer lugar via DI:
public class MeuController
{
    private readonly GitHubClient _gh;
    public MeuController(GitHubClient gh) => _gh = gh;
    public Task<Repositorio?> Index() => _gh.ObterRepoAsync("dotnet", "core");
}`})}),e.jsxs(t,{type:"info",title:"JsonContent é otimizado",children:["Os métodos ",e.jsx("code",{children:"GetFromJsonAsync"}),", ",e.jsx("code",{children:"PostAsJsonAsync"})," e ",e.jsx("code",{children:"ReadFromJsonAsync"})," vêm em ",e.jsx("code",{children:"System.Net.Http.Json"})," e usam ",e.jsx("code",{children:"System.Text.Json"})," por baixo. Eles streams direto da resposta sem alocar uma string intermediária do JSON inteiro — bem mais eficientes que ",e.jsx("code",{children:"JsonConvert.DeserializeObject(await resp.Content.ReadAsStringAsync())"}),"."]}),e.jsx("h2",{children:"Polly: retry, circuit breaker e timeout"}),e.jsxs("p",{children:['APIs externas falham. Não é "se", é "quando". ',e.jsx("strong",{children:"Polly"})," é a biblioteca padrão de resiliência em .NET, e integra com IHttpClientFactory de forma elegante. No .NET 8+ a recomendação é a abstração nova ",e.jsx("code",{children:"Microsoft.Extensions.Http.Resilience"}),", que usa Polly por baixo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// dotnet add package Microsoft.Extensions.Http.Resilience
builder.Services.AddHttpClient<GitHubClient>(c =>
    c.BaseAddress = new Uri("https://api.github.com/"))
    .AddStandardResilienceHandler(options =>
    {
        // timeout total da requisição (incluindo retries)
        options.TotalRequestTimeout.Timeout = TimeSpan.FromSeconds(30);
        // tentativa individual
        options.AttemptTimeout.Timeout = TimeSpan.FromSeconds(10);
        // retry
        options.Retry.MaxRetryAttempts = 3;
        options.Retry.BackoffType = DelayBackoffType.Exponential;
        options.Retry.UseJitter = true;
        // circuit breaker
        options.CircuitBreaker.FailureRatio = 0.5; // 50% falhas
        options.CircuitBreaker.MinimumThroughput = 10;
        options.CircuitBreaker.SamplingDuration = TimeSpan.FromSeconds(30);
    });`})}),e.jsxs("p",{children:["O ",e.jsx("strong",{children:"circuit breaker"}),' funciona como um disjuntor elétrico: depois de N falhas seguidas, ele "abre" e nem tenta mais por um tempo, devolvendo erro imediato. Isso protege a API remota de ser bombardeada quando ela está caindo, e protege seu app de ficar esperando timeout em cada chamada.']}),e.jsx("h2",{children:"Mensagens HTTP cruas (PUT, PATCH, DELETE)"}),e.jsx("pre",{children:e.jsx("code",{children:`// PUT com corpo JSON
var resp = await _http.PutAsJsonAsync($"items/{id}", new { Nome = "novo" });
resp.EnsureSuccessStatusCode(); // lança se status >= 400

// PATCH precisa montar manualmente
var req = new HttpRequestMessage(HttpMethod.Patch, $"items/{id}")
{
    Content = JsonContent.Create(new { Status = "ativo" })
};
var resp2 = await _http.SendAsync(req);

// DELETE
await _http.DeleteAsync($"items/{id}");

// Streaming de resposta grande sem carregar tudo na memória
using var stream = await _http.GetStreamAsync("download/big.zip");
await using var arquivo = File.Create("big.zip");
await stream.CopyToAsync(arquivo);`})}),e.jsxs(t,{type:"warning",title:"HttpClient é thread-safe — mas seus headers não",children:["Não modifique ",e.jsx("code",{children:"DefaultRequestHeaders"})," em tempo de execução por thread (ex.: setar Authorization diferente por usuário). Crie a mensagem com ",e.jsx("code",{children:"HttpRequestMessage.Headers"})," própria, ou use ",e.jsx("code",{children:"DelegatingHandler"})," para injetar tokens dinamicamente."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:e.jsx("code",{children:"new HttpClient()"})})," em código de produção — socket exhaustion garantido."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"EnsureSuccessStatusCode"})]})," — você processa um corpo de erro como se fosse sucesso."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"using"})," em ",e.jsx("code",{children:"HttpResponseMessage"})]})," — vazamento de conexão."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"HttpClientHandler"})," manual com factory"]})," — invalida o pool."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Configurar retry sem timeout"})," — chamadas presas se acumulam."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Use ",e.jsx("code",{children:"IHttpClientFactory"})," em vez de ",e.jsx("code",{children:"new HttpClient()"}),"."]}),e.jsx("li",{children:"Typed clients são a forma mais limpa: classe + DI + base URL configurada."}),e.jsxs("li",{children:[e.jsx("code",{children:"GetFromJsonAsync"}),"/",e.jsx("code",{children:"PostAsJsonAsync"})," deserializam direto."]}),e.jsxs("li",{children:["Adicione ",e.jsx("code",{children:"AddStandardResilienceHandler"})," para retry/circuit/timeout."]}),e.jsxs("li",{children:["Sempre trate erros com ",e.jsx("code",{children:"EnsureSuccessStatusCode"})," ou checando ",e.jsx("code",{children:"StatusCode"}),"."]})]})]})}export{o as default};
