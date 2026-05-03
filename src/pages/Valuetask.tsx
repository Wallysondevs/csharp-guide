import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Valuetask() {
  return (
    <PageContainer
      title="ValueTask<T>: async sem alocar"
      subtitle="Quando todo nanossegundo conta e a maioria das chamadas retorna na hora, a Task vira um peso. Conheça a alternativa que mora na pilha."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Toda vez que você marca um método como <code>async</code> e o tipo de retorno é <code>Task&lt;int&gt;</code>, o runtime <em>aloca</em> um objeto <code>Task</code> no <strong>heap</strong> (a área de memória onde vivem os objetos administrados pelo coletor de lixo, o <strong>Garbage Collector</strong> ou GC). Para a maioria das aplicações, isso é insignificante. Mas se um método assíncrono é chamado <strong>milhões de vezes por segundo</strong> — pense em um cache, num parser de rede, num loop quente de um servidor web — essas alocações viram lixo, viram pausas de GC, viram latência. A <code>ValueTask&lt;T&gt;</code> existe para esse cenário.
      </p>

      <h2>O problema: cada async aloca</h2>
      <p>
        Imagine que você escreve um método <code>GetUserAsync</code>. Ele primeiro tenta um cache em memória; só se o cache não tiver o valor, vai ao banco de dados. Em produção, 99% das chamadas são <em>cache hit</em> — voltam imediatamente, sem nenhuma operação realmente assíncrona. Ainda assim, com <code>Task&lt;T&gt;</code>, cada chamada cria um objeto novo:
      </p>
      <pre><code>{`public async Task<User> GetUserAsync(int id)
{
    if (_cache.TryGetValue(id, out var user))
        return user;          // 99% dos casos — síncrono

    return await _db.LoadAsync(id);
}`}</code></pre>
      <p>
        O compilador transforma esse método numa máquina de estados. Mesmo no caminho rápido, ele aloca um <code>Task&lt;User&gt;</code> só para devolver o valor. Em hot path, isso pressiona o GC.
      </p>

      <h2>A solução: ValueTask é uma struct</h2>
      <p>
        <code>ValueTask&lt;T&gt;</code> é um <strong>struct</strong> (tipo de valor, vive na pilha) que pode estar em um de três estados: já tem o resultado pronto (síncrono), embrulha uma <code>Task</code> de verdade (assíncrono), ou aponta para um <code>IValueTaskSource</code> reutilizável. No caminho rápido, nenhuma alocação acontece.
      </p>
      <pre><code>{`public ValueTask<User> GetUserAsync(int id)
{
    if (_cache.TryGetValue(id, out var user))
        return new ValueTask<User>(user);  // sem alocar nada

    return new ValueTask<User>(_db.LoadAsync(id));
}`}</code></pre>
      <p>
        Repare que o método não é mais <code>async</code> — usamos <code>async</code> só quando precisamos de fato de <code>await</code>. Aqui devolvemos manualmente uma <code>ValueTask</code> envolvendo o valor já pronto.
      </p>

      <AlertBox type="info" title="Quando usar ValueTask">
        Use <code>ValueTask&lt;T&gt;</code> quando o método (1) é chamado em hot path, e (2) <strong>frequentemente retorna sincronamente</strong>. Se ele quase sempre faz I/O real, fique com <code>Task&lt;T&gt;</code> — a complexidade extra não compensa.
      </AlertBox>

      <h2>A regra de ouro: await uma única vez</h2>
      <p>
        ValueTask vem com armadilhas. A principal: você só pode <code>await</code> uma instância <strong>uma vez</strong>. Não pode armazenar em variável, esperar duas vezes, nem chamar <code>.Result</code> e <code>await</code> juntos. Isso porque, no modo "reutilizável", a estrutura interna é devolvida a um pool depois do primeiro consumo.
      </p>
      <pre><code>{`// ❌ ERRADO — comportamento indefinido
ValueTask<User> vt = GetUserAsync(42);
var a = await vt;
var b = await vt;   // pode lançar, retornar lixo ou explodir

// ✅ CERTO — converta para Task se precisar reutilizar
Task<User> t = GetUserAsync(42).AsTask();
var a = await t;
var b = await t;   // ok, Task pode ser awaited N vezes`}</code></pre>

      <h2>Exemplo realista: cache de configuração</h2>
      <p>
        Um caso clássico é um leitor de configurações que mantém um cache em memória. Após o primeiro carregamento, todas as leituras são síncronas:
      </p>
      <pre><code>{`public sealed class ConfigCache
{
    private Dictionary<string, string>? _cached;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public ValueTask<string> GetAsync(string chave)
    {
        // Caminho rápido: cache populado, devolve direto
        if (_cached is not null && _cached.TryGetValue(chave, out var v))
            return new ValueTask<string>(v);

        // Caminho lento: precisa carregar
        return CarregarECacheAsync(chave);
    }

    private async ValueTask<string> CarregarECacheAsync(string chave)
    {
        await _lock.WaitAsync();
        try
        {
            _cached ??= await LerDoDiscoAsync();
            return _cached.TryGetValue(chave, out var v) ? v : "";
        }
        finally { _lock.Release(); }
    }

    private static Task<Dictionary<string, string>> LerDoDiscoAsync() =>
        Task.FromResult(new Dictionary<string, string> { ["debug"] = "true" });
}`}</code></pre>
      <p>
        O método público devolve <code>ValueTask</code> sem ser <code>async</code> no caminho feliz; só o método lento usa <code>async ValueTask</code>. Em produção, 99,9% das chamadas alocam <strong>zero</strong> bytes.
      </p>

      <AlertBox type="warning" title="Não vire fanático">
        Substituir todo <code>Task</code> por <code>ValueTask</code> é cargo cult. ValueTask é maior em bytes, copia mais, e perde otimizações que o runtime aplica em <code>Task</code>. Use só onde mediu benefício real com benchmarks (BenchmarkDotNet).
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Aguardar duas vezes:</strong> resultado imprevisível. Use <code>.AsTask()</code> antes.</li>
        <li><strong>Acessar <code>.Result</code> antes de completar:</strong> bloqueia ou lança. Sempre <code>await</code>.</li>
        <li><strong>Usar em APIs públicas sem necessidade:</strong> obriga consumidores a lidarem com a complexidade. Prefira <code>Task</code> em bibliotecas amplas.</li>
        <li><strong>Esquecer de medir:</strong> sem benchmark, você está adivinhando se o ganho compensa.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Task</code> é classe (heap); <code>ValueTask</code> é struct (pilha) — evita alocação no caminho síncrono.</li>
        <li>Use quando o método retorna síncrono na maioria das vezes e está em hot path.</li>
        <li><strong>Await uma única vez</strong> ou converta com <code>.AsTask()</code>.</li>
        <li>Não é substituto universal — meça antes de adotar.</li>
        <li>Cache hits, leituras de buffer e parsers em loop são casos clássicos.</li>
      </ul>
    </PageContainer>
  );
}
