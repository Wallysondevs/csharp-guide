import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HttpclientTyped() {
  return (
    <PageContainer
      title="HttpClient: typed clients e IHttpClientFactory"
      subtitle="A forma certa de fazer chamadas HTTP em .NET — sem socket exhaustion e com retry automático."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <p>
        <code>HttpClient</code> parece simples, mas é uma das classes mais traiçoeiras do .NET. Ela <em>parece</em> que deveria ser usada como qualquer outra (<code>using var c = new HttpClient(); c.GetAsync(...)</code>), mas isso causa um bug clássico: <strong>socket exhaustion</strong>. Cada novo HttpClient abre conexões TCP que demoram a fechar (ficam em estado <em>TIME_WAIT</em> por minutos). Em um servidor com tráfego, você esgota as portas locais e tudo trava. A Microsoft corrigiu isso com o <strong>IHttpClientFactory</strong>. Pense nele como uma "concessionária de carros": você não compra um carro novo a cada viagem; você pega um da frota, anda, devolve.
      </p>

      <h2>O problema antigo</h2>
      <pre><code>{`// RUIM — uso ingênuo
public async Task<string> Buscar()
{
    using var http = new HttpClient(); // CADA chamada abre conexões
    return await http.GetStringAsync("https://api.exemplo.com/dados");
}`}</code></pre>
      <p>
        Sob carga, esse código cria centenas de instâncias por segundo. As conexões TCP correspondentes ficam presas, a porta 49xxx esgota, novas chamadas falham com erros confusos como <em>"SocketException: Only one usage of each socket address..."</em>.
      </p>

      <h2>IHttpClientFactory: o jeito certo</h2>
      <p>
        A factory mantém um pool de <code>HttpMessageHandler</code> reusados, com tempo de vida controlado (default 2 min). Você só pede instâncias dela; o pool resolve o resto.
      </p>
      <pre><code>{`// Program.cs
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
}`}</code></pre>

      <h2>Named clients</h2>
      <p>
        Se você fala com várias APIs (cada uma com base URL e headers próprios), pode dar nomes:
      </p>
      <pre><code>{`builder.Services.AddHttpClient("github", c =>
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
var resp = await gh.GetAsync("repos/dotnet/core");`}</code></pre>

      <h2>Typed clients (recomendado)</h2>
      <p>
        Em vez de pedir um <code>IHttpClientFactory</code> em todo lugar, você cria uma classe que recebe um <code>HttpClient</code> já configurado. Fica tipado, testável e expressivo.
      </p>
      <pre><code>{`public class GitHubClient
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
}`}</code></pre>

      <AlertBox type="info" title="JsonContent é otimizado">
        Os métodos <code>GetFromJsonAsync</code>, <code>PostAsJsonAsync</code> e <code>ReadFromJsonAsync</code> vêm em <code>System.Net.Http.Json</code> e usam <code>System.Text.Json</code> por baixo. Eles streams direto da resposta sem alocar uma string intermediária do JSON inteiro — bem mais eficientes que <code>JsonConvert.DeserializeObject(await resp.Content.ReadAsStringAsync())</code>.
      </AlertBox>

      <h2>Polly: retry, circuit breaker e timeout</h2>
      <p>
        APIs externas falham. Não é "se", é "quando". <strong>Polly</strong> é a biblioteca padrão de resiliência em .NET, e integra com IHttpClientFactory de forma elegante. No .NET 8+ a recomendação é a abstração nova <code>Microsoft.Extensions.Http.Resilience</code>, que usa Polly por baixo:
      </p>
      <pre><code>{`// dotnet add package Microsoft.Extensions.Http.Resilience
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
    });`}</code></pre>
      <p>
        O <strong>circuit breaker</strong> funciona como um disjuntor elétrico: depois de N falhas seguidas, ele "abre" e nem tenta mais por um tempo, devolvendo erro imediato. Isso protege a API remota de ser bombardeada quando ela está caindo, e protege seu app de ficar esperando timeout em cada chamada.
      </p>

      <h2>Mensagens HTTP cruas (PUT, PATCH, DELETE)</h2>
      <pre><code>{`// PUT com corpo JSON
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
await stream.CopyToAsync(arquivo);`}</code></pre>

      <AlertBox type="warning" title="HttpClient é thread-safe — mas seus headers não">
        Não modifique <code>DefaultRequestHeaders</code> em tempo de execução por thread (ex.: setar Authorization diferente por usuário). Crie a mensagem com <code>HttpRequestMessage.Headers</code> própria, ou use <code>DelegatingHandler</code> para injetar tokens dinamicamente.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong><code>new HttpClient()</code></strong> em código de produção — socket exhaustion garantido.</li>
        <li><strong>Esquecer <code>EnsureSuccessStatusCode</code></strong> — você processa um corpo de erro como se fosse sucesso.</li>
        <li><strong>Esquecer <code>using</code> em <code>HttpResponseMessage</code></strong> — vazamento de conexão.</li>
        <li><strong>Misturar <code>HttpClientHandler</code> manual com factory</strong> — invalida o pool.</li>
        <li><strong>Configurar retry sem timeout</strong> — chamadas presas se acumulam.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Use <code>IHttpClientFactory</code> em vez de <code>new HttpClient()</code>.</li>
        <li>Typed clients são a forma mais limpa: classe + DI + base URL configurada.</li>
        <li><code>GetFromJsonAsync</code>/<code>PostAsJsonAsync</code> deserializam direto.</li>
        <li>Adicione <code>AddStandardResilienceHandler</code> para retry/circuit/timeout.</li>
        <li>Sempre trate erros com <code>EnsureSuccessStatusCode</code> ou checando <code>StatusCode</code>.</li>
      </ul>
    </PageContainer>
  );
}
