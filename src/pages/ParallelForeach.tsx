import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ParallelForeach() {
  return (
    <PageContainer
      title="Parallel.For e Parallel.ForEach para CPU-bound"
      subtitle="Paralelizando loops pesados com poucas linhas de código — e os cuidados que isso exige."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Há tarefas que <em>não esperam</em> nada externo — elas só queimam CPU: aplicar filtro em milhares de imagens, calcular hash de muitos arquivos, processar pixels, simular física. Em código sequencial elas usam apenas <strong>um núcleo</strong> do seu processador, mesmo que sua máquina tenha 16. A classe <strong>Parallel</strong> (no namespace <code>System.Threading.Tasks</code>) divide o trabalho automaticamente entre vários núcleos. É como passar de um pintor pintando uma parede para uma equipe inteira pintando trechos diferentes ao mesmo tempo.
      </p>

      <h2>Parallel.For: range numérico</h2>
      <p>
        A versão mais simples: troca um <code>for (int i = 0; i &lt; N; i++)</code> por uma versão paralela. O .NET particiona o intervalo entre os núcleos:
      </p>
      <pre><code>{`using System.Threading.Tasks;

// Versão sequencial
for (int i = 0; i < imagens.Length; i++)
    AplicarFiltro(imagens[i]);

// Versão paralela
Parallel.For(0, imagens.Length, i =>
{
    AplicarFiltro(imagens[i]);
});`}</code></pre>
      <p>
        A assinatura é <code>Parallel.For(início, fim, ação)</code>. O <code>fim</code> é exclusivo (igual ao <code>for</code> tradicional). A função recebe o índice atual.
      </p>

      <h2>Parallel.ForEach: coleção qualquer</h2>
      <p>
        Para iterar sobre <code>IEnumerable&lt;T&gt;</code> (lista, array, resultado de LINQ), use <code>ForEach</code>:
      </p>
      <pre><code>{`var arquivos = Directory.EnumerateFiles("/dados", "*.bin");

Parallel.ForEach(arquivos, arquivo =>
{
    string hash = CalcularSha256(arquivo);
    Console.WriteLine($"{arquivo}: {hash}");
});`}</code></pre>
      <p>
        Por baixo dos panos, o particionador (<em>Partitioner</em>) divide a coleção em pedaços e despacha para threads do ThreadPool. Você não controla a ordem de execução — outra grande diferença em relação ao <code>foreach</code> normal.
      </p>

      <h2>Limitando o paralelismo</h2>
      <p>
        Por padrão, <code>Parallel</code> usa todos os núcleos lógicos. Em servidores compartilhados ou quando o trabalho usa um recurso limitado (banco de dados, GPU), você quer limitar:
      </p>
      <pre><code>{`var opcoes = new ParallelOptions
{
    MaxDegreeOfParallelism = 4,             // no máximo 4 threads simultâneas
    CancellationToken = ct                  // suporta cancelamento!
};

Parallel.ForEach(itens, opcoes, item =>
{
    Processar(item);
});`}</code></pre>

      <AlertBox type="info" title="Quantos núcleos eu tenho?">
        <code>Environment.ProcessorCount</code> retorna o número de processadores lógicos vistos pelo sistema. Em uma máquina i7 com hyperthreading, costuma ser 8 ou 16.
      </AlertBox>

      <h2>Thread-safety: o calcanhar de Aquiles</h2>
      <p>
        Quando vários threads rodam o mesmo lambda ao mesmo tempo, qualquer dado <strong>compartilhado</strong> vira problema. Veja este bug clássico:
      </p>
      <pre><code>{`int total = 0;
Parallel.For(0, 1_000_000, i => total += 1);
// total NÃO será 1.000.000! Há corrida (race condition).`}</code></pre>
      <p>
        O operador <code>+=</code> não é atômico: ele lê, soma, escreve. Duas threads podem ler ao mesmo tempo e perder atualizações. Soluções:
      </p>
      <pre><code>{`// 1) Operação atômica
int total = 0;
Parallel.For(0, 1_000_000, i => Interlocked.Increment(ref total));

// 2) Acumulador local por thread (rápido — evita contenção)
long total = 0;
Parallel.For<long>(0, 1_000_000,
    () => 0L,                               // estado local inicial
    (i, state, local) => local + 1,         // acumula em local
    local => Interlocked.Add(ref total, local) // soma final
);`}</code></pre>

      <h2>Coleções thread-safe</h2>
      <p>
        Se você precisa adicionar resultados a uma coleção compartilhada, não use <code>List&lt;T&gt;</code> — use <code>ConcurrentBag&lt;T&gt;</code>, <code>ConcurrentDictionary&lt;K,V&gt;</code> ou <code>ConcurrentQueue&lt;T&gt;</code> do namespace <code>System.Collections.Concurrent</code>:
      </p>
      <pre><code>{`var resultados = new ConcurrentBag<string>();

Parallel.ForEach(arquivos, arq =>
{
    string r = ProcessarArquivo(arq);
    resultados.Add(r); // seguro entre threads
});`}</code></pre>

      <AlertBox type="warning" title="NÃO use Parallel para I/O">
        <code>Parallel.For</code> e <code>ForEach</code> bloqueiam threads enquanto o lambda roda. Se o trabalho for esperar rede/disco, você está prendendo threads do pool — destruindo escala. Para I/O, use <code>Task.WhenAll</code> ou <code>Parallel.ForEachAsync</code>.
      </AlertBox>

      <h2>Parallel.ForEachAsync (.NET 6+)</h2>
      <p>
        Para trabalho assíncrono em paralelo, surgiu <code>Parallel.ForEachAsync</code>. Ele agenda lambdas <code>async</code> respeitando o <code>MaxDegreeOfParallelism</code>:
      </p>
      <pre><code>{`var urls = new[] { "https://a.com", "https://b.com", "https://c.com" };
var http = new HttpClient();

await Parallel.ForEachAsync(urls,
    new ParallelOptions { MaxDegreeOfParallelism = 5 },
    async (url, ct) =>
    {
        string conteudo = await http.GetStringAsync(url, ct);
        Console.WriteLine($"{url}: {conteudo.Length}");
    });`}</code></pre>
      <p>
        Esse é o jeito moderno de "rodar N requisições simultâneas com limite". Antigamente o povo usava <code>SemaphoreSlim</code> + <code>Task.WhenAll</code>; hoje basta isso.
      </p>

      <h2>Quando o paralelismo não compensa</h2>
      <p>
        Existe overhead em despachar trabalho para várias threads. Se cada item leva microssegundos, paralelizar pode ser <em>mais lento</em> que sequencial. Regras de bolso:
      </p>
      <ul>
        <li>O trabalho de cada item leva pelo menos alguns milissegundos.</li>
        <li>A coleção tem milhares de itens (não dezenas).</li>
        <li>O trabalho é CPU-bound, não I/O-bound.</li>
        <li>Você minimizou estado compartilhado e contenção.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Race conditions:</strong> usar <code>+=</code>, <code>List.Add</code>, <code>Dictionary[k]=</code> sem proteção. Use <code>Interlocked</code> ou coleções concorrentes.</li>
        <li><strong>Paralelizar I/O:</strong> bloqueia threads do pool, causa starvation. Prefira <code>Parallel.ForEachAsync</code>.</li>
        <li><strong>Lambdas com side-effects de UI:</strong> <code>Parallel.For</code> roda em ThreadPool; mexer em controles dispara exceção.</li>
        <li><strong>Esperar ordem:</strong> a saída pode vir embaralhada. Se importa ordem, use o índice e ordene depois.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Parallel.For/ForEach</code> dividem trabalho CPU-bound entre núcleos automaticamente.</li>
        <li><code>ParallelOptions.MaxDegreeOfParallelism</code> limita o número de threads.</li>
        <li>Atenção a <em>race conditions</em>: use <code>Interlocked</code>, locks ou coleções concorrentes.</li>
        <li>Não use para I/O — use <code>Parallel.ForEachAsync</code> ou <code>Task.WhenAll</code>.</li>
        <li>Mensure: paralelismo só ajuda quando o trabalho por item é razoavelmente caro.</li>
      </ul>
    </PageContainer>
  );
}
