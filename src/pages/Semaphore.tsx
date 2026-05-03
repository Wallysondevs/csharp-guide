import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Semaphore() {
  return (
    <PageContainer
      title="SemaphoreSlim: controlando concorrência async"
      subtitle="Quando você quer que no máximo N tarefas rodem ao mesmo tempo — nem mais, nem menos."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine uma pizzaria com cinco fornos. Não importa quantos pedidos cheguem à cozinha: só cinco pizzas podem assar simultaneamente. Quando uma sai, a próxima da fila entra. Em programação, esse mecanismo se chama <strong>semáforo</strong>, e o C# oferece o <code>SemaphoreSlim</code> — uma versão leve, otimizada para uso dentro de um único processo e, mais importante, <strong>compatível com <code>async</code>/<code>await</code></strong>.
      </p>

      <h2>O problema: chamadas concorrentes demais</h2>
      <p>
        Suponha que você precisa baixar 1000 URLs. Disparar todas com <code>Task.WhenAll</code> de uma vez é desastroso: o sistema operacional rejeita conexões, a API remota te bloqueia por flood, a rede congestiona. Você quer um meio-termo: rodar, digamos, no máximo <strong>5 downloads em paralelo</strong>.
      </p>
      <pre><code>{`// ❌ Dispara mil requisições simultâneas — provavelmente quebra
var tarefas = urls.Select(u => httpClient.GetStringAsync(u));
var resultados = await Task.WhenAll(tarefas);`}</code></pre>

      <h2>SemaphoreSlim: a fila controlada</h2>
      <p>
        Você cria um semáforo dizendo quantas "vagas" existem. Cada tarefa, antes de fazer o trabalho, chama <code>WaitAsync()</code> — se houver vaga, passa direto; se não, fica esperando assincronamente (sem bloquear thread). Ao terminar, chama <code>Release()</code> para devolver a vaga.
      </p>
      <pre><code>{`// 5 vagas iniciais, máximo de 5 totais
var semaforo = new SemaphoreSlim(initialCount: 5, maxCount: 5);

async Task BaixarAsync(string url, HttpClient http)
{
    await semaforo.WaitAsync();    // pega vaga (ou espera)
    try
    {
        var html = await http.GetStringAsync(url);
        Console.WriteLine($"{url}: {html.Length} bytes");
    }
    finally
    {
        semaforo.Release();        // devolve vaga SEMPRE
    }
}

var http = new HttpClient();
var tarefas = urls.Select(u => BaixarAsync(u, http));
await Task.WhenAll(tarefas);`}</code></pre>
      <p>
        Repare em duas coisas críticas: o <code>Release()</code> está dentro de <code>finally</code>, garantindo que a vaga é liberada mesmo se a requisição lançar exceção, e usamos <code>WaitAsync</code> (não <code>Wait</code>) para não bloquear a thread enquanto espera.
      </p>

      <AlertBox type="danger" title="Esquecer o Release = deadlock">
        Se você usar <code>WaitAsync()</code> e o código quebrar antes do <code>Release()</code>, a vaga nunca é devolvida. Em pouco tempo, o pool esgota e <strong>todas as tarefas seguintes ficam presas para sempre</strong>. O <code>finally</code> não é opcional.
      </AlertBox>

      <h2>Sintaxe alternativa: <code>using</code> com helper</h2>
      <p>
        Para reduzir o boilerplate, é comum criar uma extensão que devolve um <code>IDisposable</code>:
      </p>
      <pre><code>{`public static class SemaphoreExtensions
{
    public static async Task<IDisposable> EnterAsync(this SemaphoreSlim s)
    {
        await s.WaitAsync();
        return new Releaser(s);
    }
    private sealed class Releaser(SemaphoreSlim s) : IDisposable
    {
        public void Dispose() => s.Release();
    }
}

// uso:
using (await semaforo.EnterAsync())
{
    var html = await http.GetStringAsync(url);
}`}</code></pre>

      <h2>lock vs SemaphoreSlim vs Mutex</h2>
      <p>
        Três ferramentas parecidas, com propósitos distintos:
      </p>
      <table>
        <thead><tr><th>Ferramenta</th><th>Concorrência</th><th>Async?</th><th>Entre processos?</th></tr></thead>
        <tbody>
          <tr><td><code>lock</code></td><td>1</td><td>Não</td><td>Não</td></tr>
          <tr><td><code>SemaphoreSlim</code></td><td>N (configurável)</td><td>Sim</td><td>Não</td></tr>
          <tr><td><code>Mutex</code></td><td>1</td><td>Não</td><td>Sim (com nome)</td></tr>
        </tbody>
      </table>
      <p>
        Use <code>lock</code> para proteger uma seção curta e síncrona. Use <code>SemaphoreSlim(1, 1)</code> quando precisa do mesmo efeito mas em código <code>async</code>. Use <code>SemaphoreSlim(N)</code> para limitar concorrência. <code>Mutex</code> só faz sentido se você precisa coordenar instâncias diferentes do <em>mesmo</em> programa rodando ao mesmo tempo (raro).
      </p>

      <h2>Caso de produção: throttling de uma API externa</h2>
      <p>
        A API do GitHub permite 30 requisições por minuto sem autenticação. Combinando <code>SemaphoreSlim</code> com <code>Task.Delay</code>, conseguimos respeitar o limite:
      </p>
      <pre><code>{`public sealed class GitHubClient(HttpClient http)
{
    private readonly SemaphoreSlim _slot = new(initialCount: 30, maxCount: 30);

    public async Task<string> GetUserAsync(string login)
    {
        await _slot.WaitAsync();
        // libera a vaga só depois de 60s — janela rolante
        _ = Task.Delay(TimeSpan.FromSeconds(60))
                .ContinueWith(_ => _slot.Release());

        return await http.GetStringAsync($"https://api.github.com/users/{login}");
    }
}`}</code></pre>
      <p>
        Aqui o <code>Release</code> não é imediato: ele acontece 60 segundos depois, simulando uma janela móvel. Se 30 chamadas dispararem em rajada, a 31ª espera até a primeira "vencer".
      </p>

      <AlertBox type="info" title="SemaphoreSlim aceita CancellationToken">
        <code>WaitAsync(CancellationToken)</code> permite desistir da espera. Útil para timeouts: <code>await s.WaitAsync(cts.Token)</code> lança <code>OperationCanceledException</code> se o token disparar antes de você conseguir vaga.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Release sem Wait:</strong> aumenta o contador além do limite, quebrando o limite máximo.</li>
        <li><strong>Wait sem Release no finally:</strong> deadlock silencioso ao primeiro erro.</li>
        <li><strong>Usar <code>Wait()</code> em código async:</strong> bloqueia a thread, desperdiçando o ganho do async.</li>
        <li><strong>Compartilhar o mesmo semáforo entre operações independentes:</strong> cria contenção desnecessária.</li>
        <li><strong>Esquecer de fazer <code>Dispose()</code>:</strong> <code>SemaphoreSlim</code> é <code>IDisposable</code>, libere quando não precisar mais.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>SemaphoreSlim(N)</code> permite no máximo N tarefas simultâneas.</li>
        <li>Use <code>WaitAsync()</code> para não bloquear thread em código assíncrono.</li>
        <li><code>Release()</code> sempre dentro de <code>finally</code>.</li>
        <li>Para travas exclusivas em async, use <code>SemaphoreSlim(1, 1)</code> em vez de <code>lock</code>.</li>
        <li>Aceita <code>CancellationToken</code> para timeouts elegantes.</li>
        <li>Não confunda com <code>Mutex</code> (entre processos) ou <code>lock</code> (síncrono).</li>
      </ul>
    </PageContainer>
  );
}
