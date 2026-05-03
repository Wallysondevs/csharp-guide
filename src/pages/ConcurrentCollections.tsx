import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConcurrentCollections() {
  return (
    <PageContainer
      title="Coleções concorrentes para multi-thread"
      subtitle="ConcurrentDictionary, ConcurrentQueue, ConcurrentBag e BlockingCollection — coleções pensadas para várias threads ao mesmo tempo."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine três caixas de supermercado tentando atualizar a mesma planilha de estoque ao mesmo tempo, sem combinar nada. O resultado seria caos: dois caixas leem "10 bananas", ambos vendem 1, ambos escrevem "9" — sumiu uma banana do registro. Em código, isso se chama <strong>condição de corrida</strong>, e acontece quando várias <em>threads</em> (linhas de execução paralelas) tocam a mesma estrutura de dados sem coordenação. As <strong>coleções concorrentes</strong> de C# resolvem isso: elas vivem no namespace <code>System.Collections.Concurrent</code> e são desenhadas para múltiplas threads sem precisar de <code>lock</code> manual.
      </p>

      <h2>O problema com Dictionary comum</h2>
      <p>
        Um <code>Dictionary&lt;K,V&gt;</code> tradicional não é seguro para uso paralelo. Duas threads escrevendo simultaneamente podem corromper a estrutura interna do hash e causar laço infinito ou exceções estranhas.
      </p>
      <pre><code>{`var contagem = new Dictionary<string, int>();

// PERIGOSO: várias tasks alterando o mesmo dicionário
Parallel.For(0, 1000, i =>
{
    var chave = (i % 10).ToString();
    if (contagem.ContainsKey(chave))
        contagem[chave]++;     // race condition aqui
    else
        contagem[chave] = 1;
});
// Resultado imprevisível ou exceção!`}</code></pre>

      <h2>ConcurrentDictionary: a solução natural</h2>
      <p>
        <code>ConcurrentDictionary&lt;K,V&gt;</code> usa <em>locking</em> particionado internamente: ele divide o dicionário em vários "balcões" para que threads diferentes possam escrever em chaves diferentes sem se atrapalharem.
      </p>
      <pre><code>{`using System.Collections.Concurrent;

var contagem = new ConcurrentDictionary<string, int>();

Parallel.For(0, 1000, i =>
{
    var chave = (i % 10).ToString();
    // AddOrUpdate: se não existe insere 1, se existe aplica a função
    contagem.AddOrUpdate(
        chave,
        addValue: 1,
        updateValueFactory: (k, v) => v + 1);
});

foreach (var (k, v) in contagem)
    Console.WriteLine($"{k}: {v}"); // 100, 100, 100, ...`}</code></pre>

      <h2>GetOrAdd: idempotência elegante</h2>
      <p>
        Um padrão comum é "se a chave existir, devolva o valor; senão, calcule e insira agora". Em código não-concorrente, isso vira um <code>if</code>. Em código concorrente, as duas threads podem cair no <code>if</code> ao mesmo tempo e calcular duas vezes. <code>GetOrAdd</code> resolve com uma operação atômica:
      </p>
      <pre><code>{`var cache = new ConcurrentDictionary<string, byte[]>();

byte[] CarregarArquivo(string caminho)
{
    return cache.GetOrAdd(caminho, p =>
    {
        // factory só executa se a chave ainda não existe
        Console.WriteLine($"Lendo {p} do disco...");
        return File.ReadAllBytes(p);
    });
}`}</code></pre>

      <AlertBox type="warning" title="Factory de GetOrAdd pode rodar mais de uma vez">
        Se duas threads chamam <code>GetOrAdd</code> para a mesma chave inexistente <em>ao mesmo tempo</em>, a factory pode executar mais de uma vez — só uma das saídas será mantida. Para operações caras ou com efeitos colaterais (I/O, escrita), use <code>Lazy&lt;T&gt;</code> como valor para garantir execução única.
      </AlertBox>

      <h2>ConcurrentQueue e ConcurrentStack</h2>
      <p>
        Versões thread-safe de Queue e Stack. Métodos clássicos viraram "Try":
      </p>
      <pre><code>{`var fila = new ConcurrentQueue<string>();
fila.Enqueue("tarefa-1");
fila.Enqueue("tarefa-2");

if (fila.TryDequeue(out var item))
    Console.WriteLine($"Processando {item}");

var pilha = new ConcurrentStack<int>();
pilha.Push(10);
pilha.PushRange(new[] { 20, 30, 40 }); // empilha vários atomicamente

if (pilha.TryPop(out var topo))
    Console.WriteLine(topo); // 40`}</code></pre>

      <h2>ConcurrentBag: quando ordem não importa</h2>
      <p>
        <code>ConcurrentBag&lt;T&gt;</code> é uma "sacola" sem ordem garantida. Otimizada para o cenário em que cada thread adiciona <em>e</em> consome itens (ela mantém uma sacolinha por thread). Se você só consome de fora, prefira <code>ConcurrentQueue</code>.
      </p>
      <pre><code>{`var resultados = new ConcurrentBag<int>();

Parallel.For(1, 1001, i =>
{
    int quadrado = i * i;
    resultados.Add(quadrado);
});

Console.WriteLine($"Total: {resultados.Count}");        // 1000
Console.WriteLine($"Soma: {resultados.Sum()}");`}</code></pre>

      <h2>BlockingCollection: produtor-consumidor</h2>
      <p>
        <code>BlockingCollection&lt;T&gt;</code> é um wrapper que <em>bloqueia</em> consumidores quando está vazia e (opcionalmente) bloqueia produtores quando enche. É a ferramenta clássica para o padrão <strong>produtor-consumidor</strong>.
      </p>
      <pre><code>{`// Capacidade máxima de 5 itens (back-pressure)
var canal = new BlockingCollection<int>(boundedCapacity: 5);

// Produtor: gera 20 números e fecha o canal
var produtor = Task.Run(() =>
{
    for (int i = 1; i <= 20; i++)
    {
        canal.Add(i);
        Console.WriteLine($"Produzi {i}");
    }
    canal.CompleteAdding(); // sinaliza fim
});

// Consumidor: drena o canal até CompleteAdding ser chamado
var consumidor = Task.Run(() =>
{
    foreach (var item in canal.GetConsumingEnumerable())
        Console.WriteLine($"Consumi {item}");
});

await Task.WhenAll(produtor, consumidor);`}</code></pre>

      <AlertBox type="info" title="Channels: a alternativa moderna">
        Em código novo, considere também <code>System.Threading.Channels</code> (Channel&lt;T&gt;) — uma API mais moderna, async-first, frequentemente mais performática que BlockingCollection para o mesmo padrão produtor-consumidor.
      </AlertBox>

      <h2>Quando usar lock comum em vez disso</h2>
      <p>
        Coleções concorrentes têm overhead. Para casos simples — pouca contenção, poucas threads — um <code>lock</code> em torno de uma <code>List</code> ou <code>Dictionary</code> normal pode ser mais rápido e mais legível:
      </p>
      <pre><code>{`var lista = new List<string>();
var trava = new object();

void AdicionarSeguro(string item)
{
    lock (trava)
    {
        lista.Add(item);
    }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Achar que <code>foreach</code> em ConcurrentDictionary tira "snapshot consistente"</strong>: ele percorre uma versão consistente, mas inserções concorrentes podem ou não aparecer.</li>
        <li><strong>Confiar que <code>Count</code> é exato</strong>: em coleções concorrentes, <code>Count</code> é uma aproximação no momento da leitura. Pode mudar entre duas chamadas.</li>
        <li><strong>Esquecer <code>CompleteAdding</code></strong> em BlockingCollection: o consumidor fica preso eternamente.</li>
        <li><strong>Usar ConcurrentBag quando ordem importa</strong>: ela é otimizada para fonte = consumidor; ordem é arbitrária.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dictionary/List comuns NÃO são seguros para multi-thread.</li>
        <li><code>ConcurrentDictionary</code> com <code>AddOrUpdate</code> e <code>GetOrAdd</code> resolve a maioria dos casos.</li>
        <li><code>ConcurrentQueue/Stack</code> têm versões "Try" para todas as operações.</li>
        <li><code>BlockingCollection</code> implementa produtor-consumidor com bloqueio.</li>
        <li>Para concorrência leve, um <code>lock</code> simples pode ser melhor.</li>
      </ul>
    </PageContainer>
  );
}
