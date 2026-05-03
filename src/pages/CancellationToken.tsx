import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CancellationToken() {
  return (
    <PageContainer
      title="CancellationToken: cancelando operações async"
      subtitle="O padrão cooperativo do .NET para interromper trabalho longo de forma limpa."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine que você abriu um vídeo gigante para baixar e mudou de ideia — clicou em "cancelar". Em código, parar uma operação em andamento <em>de forma segura</em> é mais difícil do que parece: você não pode simplesmente "matar" uma thread (isso deixa recursos pendurados, conexões abertas, arquivos meio escritos). A solução do .NET é o padrão <strong>cooperativo</strong>: o código que está trabalhando verifica, de tempos em tempos, se foi pedido para parar — através de um objeto chamado <strong>CancellationToken</strong>. Quando vê o pedido, ele encerra graciosamente. Pense no token como uma plaquinha de "PARE" que alguém de fora pode levantar; o trabalhador olha para ela periodicamente.
      </p>

      <h2>Os dois personagens: Source e Token</h2>
      <p>
        O modelo tem duas peças:
      </p>
      <ul>
        <li><strong>CancellationTokenSource</strong>: quem <em>solicita</em> o cancelamento. Tem o método <code>Cancel()</code>.</li>
        <li><strong>CancellationToken</strong>: quem é <em>verificado</em> pelo trabalho. É passado como argumento.</li>
      </ul>
      <pre><code>{`using System.Threading;
using System.Threading.Tasks;

var cts = new CancellationTokenSource();
CancellationToken token = cts.Token;

Task tarefa = TrabalharAsync(token);

// Em algum lugar (botão, timeout, etc.)
cts.Cancel(); // levanta a plaquinha PARE

try { await tarefa; }
catch (OperationCanceledException) { Console.WriteLine("Cancelado!"); }`}</code></pre>

      <h2>Passando o token a métodos do .NET</h2>
      <p>
        Quase todo método assíncrono moderno aceita um <code>CancellationToken</code> como último parâmetro. Repassá-lo é o caminho mais simples — eles já fazem todo o trabalho de checagem e lançam <code>OperationCanceledException</code> quando preciso:
      </p>
      <pre><code>{`async Task BaixarArquivoAsync(string url, string destino, CancellationToken ct)
{
    using var http = new HttpClient();

    // O token cancela a request HTTP no meio da rede se necessário
    using var resp = await http.GetAsync(url,
        HttpCompletionOption.ResponseHeadersRead, ct);

    using var arq = File.Create(destino);
    await resp.Content.CopyToAsync(arq, ct);
}`}</code></pre>
      <p>
        Sem cancelamento, um download de 2 GB rodaria até o fim mesmo se o usuário desistisse. Com o token propagado, ele para no próximo bloco de bytes lido.
      </p>

      <h2>Em loops: ThrowIfCancellationRequested</h2>
      <p>
        Se você tem um loop CPU-bound (sem chamadas I/O assíncronas), precisa checar o token manualmente. Há duas formas:
      </p>
      <pre><code>{`void Processar(IEnumerable<Item> itens, CancellationToken ct)
{
    foreach (var item in itens)
    {
        // Forma 1: lança OperationCanceledException se foi pedido cancelar
        ct.ThrowIfCancellationRequested();

        // Forma 2: checagem manual (raro — prefira a forma 1)
        if (ct.IsCancellationRequested) return;

        ProcessarItem(item);
    }
}`}</code></pre>
      <p>
        A forma com exceção é preferida porque propaga naturalmente para cima e é capturada por <code>try/catch (OperationCanceledException)</code> no chamador.
      </p>

      <AlertBox type="info" title="Por que cooperativo?">
        Antigamente havia <code>Thread.Abort()</code>, que matava a thread brutalmente. Resultado? Recursos vazavam, locks ficavam pendurados, processos corrompiam. O cancelamento cooperativo é mais trabalhoso, mas <strong>seguro</strong>: o código sempre tem chance de limpar antes de sair.
      </AlertBox>

      <h2>Cancelar após timeout</h2>
      <p>
        <code>CancellationTokenSource</code> tem construtor que dispara o cancelamento sozinho após X tempo:
      </p>
      <pre><code>{`// Cancela automaticamente após 5 segundos
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));

try
{
    var resp = await http.GetStringAsync("https://lento.com", cts.Token);
}
catch (OperationCanceledException) when (cts.IsCancellationRequested)
{
    Console.WriteLine("Servidor demorou demais!");
}`}</code></pre>
      <p>
        Esse padrão é a forma idiomática de timeout em código async no .NET — bem melhor que o velho <code>Task.WhenAny</code> com Task.Delay.
      </p>

      <h2>Combinando múltiplos tokens</h2>
      <p>
        Às vezes você tem vários motivos para cancelar (timeout + botão do usuário + shutdown da app). Combine-os com <code>CreateLinkedTokenSource</code>:
      </p>
      <pre><code>{`async Task ProcessarAsync(CancellationToken externalCt)
{
    using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(30));

    // Cancela se QUALQUER um for cancelado
    using var combinado = CancellationTokenSource.CreateLinkedTokenSource(
        externalCt, timeout.Token);

    await TarefaPesadaAsync(combinado.Token);
}`}</code></pre>

      <h2>Register: callback ao cancelar</h2>
      <p>
        Para reagir ao cancelamento de forma customizada (ex.: cancelar uma requisição em uma biblioteca antiga), use <code>token.Register</code>:
      </p>
      <pre><code>{`var cts = new CancellationTokenSource();
var conn = new SqlConnection(/*...*/);

// Quando cancelarem, fecha a conexão
using var registro = cts.Token.Register(() => conn.Close());`}</code></pre>
      <p>
        O <code>Register</code> retorna um <code>IDisposable</code>; descartar libera o callback caso você não precise mais.
      </p>

      <h2>Em ASP.NET Core: HttpContext.RequestAborted</h2>
      <p>
        Frameworks já fornecem tokens prontos. ASP.NET Core dá <code>HttpContext.RequestAborted</code>, que cancela quando o cliente fecha a conexão:
      </p>
      <pre><code>{`[HttpGet("relatorio")]
public async Task<IActionResult> GerarAsync(CancellationToken ct)
{
    // 'ct' já vem ligado ao RequestAborted automaticamente
    var dados = await _servico.GerarRelatorioAsync(ct);
    return Ok(dados);
}`}</code></pre>
      <p>
        Se o usuário fecha a aba do navegador, o token cancela imediatamente — você economiza CPU/banco de dados.
      </p>

      <AlertBox type="warning" title="OperationCanceledException ≠ erro">
        Não logue como erro grave. Cancelamento é fluxo normal — geralmente o usuário pediu, ou um timeout configurado por você disparou. Trate em catch separado.
      </AlertBox>

      <h2>CancellationToken.None: quando não cancelar</h2>
      <p>
        Se o método exige um token mas você realmente não quer cancelar (em testes, scripts simples), passe <code>CancellationToken.None</code>. Ele é uma estrutura imutável que nunca cancela:
      </p>
      <pre><code>{`var dados = await BuscarAsync(CancellationToken.None);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de propagar o token:</strong> seu método aceita <code>CancellationToken</code> mas não passa adiante para as chamadas internas — cancelar não tem efeito.</li>
        <li><strong>Não dispor o CancellationTokenSource:</strong> ele tem recursos internos (especialmente com timeout). Use <code>using var cts = ...</code>.</li>
        <li><strong>Capturar OperationCanceledException como Exception genérica:</strong> dificulta distinguir cancelamento de erro real. Capture-a separadamente.</li>
        <li><strong>Loops longos sem checagem:</strong> se um for de 10 milhões de iterações não chama <code>ThrowIfCancellationRequested</code>, o token é inútil até o loop terminar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Cancelamento é <em>cooperativo</em>: o código verifica o token periodicamente.</li>
        <li><code>CancellationTokenSource</code> dispara, <code>CancellationToken</code> é consultado.</li>
        <li>Métodos do .NET aceitam <code>CancellationToken</code> como último parâmetro — propague.</li>
        <li><code>ThrowIfCancellationRequested</code> dentro de loops CPU-bound.</li>
        <li>Timeout: <code>new CancellationTokenSource(TimeSpan.FromSeconds(N))</code>.</li>
        <li><code>CreateLinkedTokenSource</code> combina vários tokens.</li>
      </ul>
    </PageContainer>
  );
}
