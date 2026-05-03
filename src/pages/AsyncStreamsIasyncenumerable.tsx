import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AsyncStreamsIasyncenumerable() {
  return (
    <PageContainer
      title="async streams: IAsyncEnumerable<T> e await foreach"
      subtitle="Iterando sobre dados que chegam aos poucos — sem carregar tudo em memória."
      difficulty="avancado"
      timeToRead="12 min"
    >
      <p>
        Imagine ler um livro que ainda está sendo escrito: você lê o capítulo 1 enquanto o autor digita o 2. Não faz sentido esperar o livro inteiro pronto para começar. Em programação, vivemos isso o tempo todo: receber linhas de um arquivo enorme, páginas de uma API REST, eventos de um sensor, registros de um banco de dados. Antes do C# 8, tínhamos duas opções ruins: 1) carregar tudo numa <code>List&lt;T&gt;</code> em memória (estoura RAM), ou 2) usar <code>IEnumerable&lt;T&gt;</code> com chamadas <em>bloqueantes</em> dentro do iterador (trava thread). O C# 8 introduziu <strong>async streams</strong> — a combinação de <code>IAsyncEnumerable&lt;T&gt;</code>, <code>yield return</code> em métodos <code>async</code>, e <code>await foreach</code> no consumidor. É iteração preguiçosa <em>e</em> assíncrona ao mesmo tempo.
      </p>

      <h2>Produzindo um async stream</h2>
      <p>
        Você marca o método como <code>async</code>, declara o tipo de retorno como <code>IAsyncEnumerable&lt;T&gt;</code>, e usa <code>yield return</code> para emitir valores e <code>await</code> entre eles:
      </p>
      <pre><code>{`using System.Collections.Generic;
using System.Threading.Tasks;

// Lê linhas de um arquivo, simulando latência
public async IAsyncEnumerable<string> LerLinhasAsync(string caminho)
{
    using var reader = new StreamReader(caminho);
    string? linha;
    while ((linha = await reader.ReadLineAsync()) != null)
    {
        yield return linha; // emite cada linha conforme é lida
    }
}`}</code></pre>
      <p>
        Compilação: o C# transforma esse método numa <em>state machine</em> que combina o iterador (de <code>yield</code>) com a máquina de async (de <code>await</code>). Você não vê isso — só usa.
      </p>

      <h2>Consumindo com await foreach</h2>
      <p>
        Do outro lado, em vez de <code>foreach</code>, use <code>await foreach</code>:
      </p>
      <pre><code>{`await foreach (string linha in LerLinhasAsync("dados.csv"))
{
    Console.WriteLine(linha);
    if (linha.StartsWith("FIM")) break;
}`}</code></pre>
      <p>
        A cada iteração, o runtime espera o próximo item assincronamente — sem bloquear thread, sem alocar lista. Você pode <code>break</code> a qualquer momento; o restante do arquivo nunca é lido.
      </p>

      <AlertBox type="info" title="Diferença para Task<List<T>>">
        Um método <code>async Task&lt;List&lt;Linha&gt;&gt; LerTudoAsync()</code> precisa terminar de ler tudo antes de devolver — bloqueia memória e adia o primeiro resultado. Um <code>IAsyncEnumerable&lt;Linha&gt;</code> entrega itens conforme chegam, com memória mínima.
      </AlertBox>

      <h2>Exemplo prático: paginação de API</h2>
      <p>
        Caso clássico — uma API REST devolve dados em páginas (<code>?page=1</code>, <code>?page=2</code>...). Você quer iterar todos os registros como se fossem um único stream:
      </p>
      <pre><code>{`public async IAsyncEnumerable<Pedido> ObterTodosPedidosAsync(
    [System.Runtime.CompilerServices.EnumeratorCancellation]
    CancellationToken ct = default)
{
    int pagina = 1;
    while (true)
    {
        ct.ThrowIfCancellationRequested();

        var url = $"https://api.exemplo.com/pedidos?page={pagina}";
        var resp = await _http.GetFromJsonAsync<RespostaPaginada>(url, ct);

        if (resp is null || resp.Itens.Count == 0) yield break; // fim

        foreach (var p in resp.Itens)
            yield return p;

        if (!resp.TemMais) yield break;
        pagina++;
    }
}

// Uso:
await foreach (var pedido in ObterTodosPedidosAsync(ct).WithCancellation(ct))
{
    Console.WriteLine(pedido.Id);
}`}</code></pre>
      <p>
        Você nunca tem mais de uma página em memória. O consumidor pode parar a qualquer hora — e nenhuma página extra é baixada.
      </p>

      <h2>Cancellation com [EnumeratorCancellation]</h2>
      <p>
        Note o atributo <code>[EnumeratorCancellation]</code> no parâmetro acima. Ele é necessário porque, quando você usa <code>WithCancellation(ct)</code> no consumidor, o token precisa "fluir" para o parâmetro do método produtor:
      </p>
      <pre><code>{`// Sem o atributo, esse 'ct' fica ignorado quando o caller faz WithCancellation
public async IAsyncEnumerable<int> ContarAsync(
    [EnumeratorCancellation] CancellationToken ct = default)
{
    for (int i = 0; i < 1000; i++)
    {
        ct.ThrowIfCancellationRequested();
        await Task.Delay(100, ct);
        yield return i;
    }
}

// O token externo é repassado para o ct do método
var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
try
{
    await foreach (var n in ContarAsync().WithCancellation(cts.Token))
        Console.WriteLine(n);
}
catch (OperationCanceledException) { Console.WriteLine("Parou."); }`}</code></pre>

      <h2>Comparação: async stream vs List + await</h2>
      <table>
        <thead>
          <tr><th>Aspecto</th><th>Task&lt;List&lt;T&gt;&gt;</th><th>IAsyncEnumerable&lt;T&gt;</th></tr>
        </thead>
        <tbody>
          <tr><td>Primeiro item</td><td>Só ao final</td><td>Imediato</td></tr>
          <tr><td>Memória</td><td>Toda a coleção</td><td>Item a item</td></tr>
          <tr><td>break early</td><td>Inútil (já carregou)</td><td>Para de processar</td></tr>
          <tr><td>API</td><td>Madura, simples</td><td>C# 8+ apenas</td></tr>
          <tr><td>Composição LINQ</td><td>LINQ normal</td><td><code>System.Linq.Async</code></td></tr>
        </tbody>
      </table>

      <h2>LINQ assíncrono</h2>
      <p>
        O pacote NuGet <code>System.Linq.Async</code> traz <code>WhereAwait</code>, <code>SelectAwait</code>, <code>FirstAsync</code>, <code>ToListAsync</code> e amigos para <code>IAsyncEnumerable&lt;T&gt;</code>:
      </p>
      <pre><code>{`var grandes = await ObterTodosPedidosAsync()
    .Where(p => p.Total > 1000)
    .Take(50)
    .ToListAsync();`}</code></pre>

      <h2>Configurando ConfigureAwait</h2>
      <p>
        Em código de biblioteca, você pode controlar o <code>ConfigureAwait</code> de cada <code>await</code> dentro do <code>foreach</code> com <code>.ConfigureAwait(false)</code>:
      </p>
      <pre><code>{`await foreach (var item in stream.ConfigureAwait(false))
{
    Processar(item);
}`}</code></pre>

      <AlertBox type="warning" title="Não use Task.WhenAll com IAsyncEnumerable">
        Async streams são, por natureza, sequenciais. Se você quer paralelismo (ex.: processar páginas em paralelo), use <code>Channel</code> ou <code>Parallel.ForEachAsync</code>.
      </AlertBox>

      <h2>Quando preferir async stream</h2>
      <ul>
        <li>Dados que <em>chegam</em> em pedaços (rede, arquivo, sensor).</li>
        <li>Você não sabe quantos itens virão (talvez infinito).</li>
        <li>Memória é restrita ou itens são grandes.</li>
        <li>O consumidor pode parar antes do fim.</li>
      </ul>
      <p>
        Se você sempre precisa de todos os itens em memória de uma vez (ex.: para ordenar globalmente), uma <code>Task&lt;List&lt;T&gt;&gt;</code> ainda é mais simples.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>[EnumeratorCancellation]</code>:</strong> <code>WithCancellation</code> no caller não cancela nada dentro do produtor.</li>
        <li><strong>Misturar <code>foreach</code> com <code>IAsyncEnumerable</code>:</strong> não compila. Use <code>await foreach</code>.</li>
        <li><strong>Acumular o stream em lista por hábito:</strong> derrota o propósito. Itere preguiçosamente.</li>
        <li><strong>Esperar paralelismo:</strong> async stream é sequencial. Use Channels ou ParallelForEachAsync para concorrência.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>IAsyncEnumerable&lt;T&gt;</code> = sequência preguiçosa <em>e</em> assíncrona.</li>
        <li>Produza com <code>async</code> + <code>yield return</code> + <code>await</code>.</li>
        <li>Consuma com <code>await foreach</code>.</li>
        <li>Use <code>[EnumeratorCancellation]</code> para integrar <code>CancellationToken</code>.</li>
        <li>Evite carregar tudo em <code>List&lt;T&gt;</code> quando não precisa — economize memória e latência.</li>
        <li><code>System.Linq.Async</code> traz operadores LINQ para esses streams.</li>
      </ul>
    </PageContainer>
  );
}
