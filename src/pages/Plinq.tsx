import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Plinq() {
  return (
    <PageContainer
      title="PLINQ: paralelizando consultas LINQ"
      subtitle="Como transformar uma query LINQ sequencial em uma versão multi-core com uma única linha."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <p>
        <strong>LINQ</strong> (Language Integrated Query) é o sistema de consultas embutido no C# — aquele <code>numeros.Where(x =&gt; x &gt; 10).Select(...)</code>. <strong>PLINQ</strong> é a versão paralela: <em>Parallel LINQ</em>. A ideia é genial: você adiciona <code>.AsParallel()</code> em qualquer ponto da consulta e o motor distribui o trabalho entre os núcleos do processador. Sintaticamente é quase igual; por baixo, ele particiona a coleção, processa em paralelo e reúne os resultados. Pense numa biblioteca onde, em vez de um bibliotecário catalogar 10 mil livros, dez bibliotecários catalogam mil cada — terminando em 1/10 do tempo.
      </p>

      <h2>De LINQ para PLINQ: uma linha de diferença</h2>
      <p>
        Veja o antes e depois:
      </p>
      <pre><code>{`using System.Linq;

// LINQ sequencial
var primos = numeros
    .Where(n => EhPrimo(n))   // EhPrimo é caro: testa divisibilidade
    .ToList();

// PLINQ — distribui Where entre vários núcleos
var primosPar = numeros
    .AsParallel()
    .Where(n => EhPrimo(n))
    .ToList();`}</code></pre>
      <p>
        <code>.AsParallel()</code> retorna um <code>ParallelQuery&lt;T&gt;</code>, e dali em diante todos os operadores LINQ rodam em sua versão paralela. A coleção é particionada (em pedaços iguais ou dinâmicos), e cada núcleo processa um pedaço.
      </p>

      <h2>Quando PLINQ ajuda</h2>
      <p>
        PLINQ não é mágica. Há custo de coordenação entre threads. Ele compensa quando:
      </p>
      <ul>
        <li><strong>Trabalho por item é caro</strong>: <code>EhPrimo</code>, decodificação de imagem, parsing de XML grande. Para somar inteiros, paralelismo só atrapalha.</li>
        <li><strong>Coleção é grande</strong>: dezenas de milhares de itens em diante.</li>
        <li><strong>É CPU-bound</strong>: nada de chamadas HTTP/banco. Para I/O, use async/await.</li>
        <li><strong>Não há dependência entre itens</strong>: cada item processado de forma independente.</li>
      </ul>

      <pre><code>{`var primosGrandes = Enumerable.Range(2, 10_000_000)
    .AsParallel()
    .Where(EhPrimo)
    .Count();`}</code></pre>

      <AlertBox type="info" title="Sempre meça">
        Em coleções pequenas ou trabalho leve, PLINQ é <em>mais lento</em> que LINQ comum por causa do overhead de particionamento. Use <code>Stopwatch</code> ou benchmarks (BenchmarkDotNet) antes de assumir ganho.
      </AlertBox>

      <h2>Ordem dos resultados</h2>
      <p>
        Por padrão, PLINQ <strong>não preserva a ordem</strong> da entrada. Ele entrega resultados conforme cada partição termina. Para algumas queries (contagens, somas) isso não importa; para outras (filtrar mantendo posição) importa muito:
      </p>
      <pre><code>{`// Sem AsOrdered — resultado pode vir embaralhado
var ids = registros
    .AsParallel()
    .Where(r => r.Ativo)
    .Select(r => r.Id);

// Com AsOrdered — ordem original preservada (custa um pouco mais)
var idsEmOrdem = registros
    .AsParallel()
    .AsOrdered()
    .Where(r => r.Ativo)
    .Select(r => r.Id);`}</code></pre>
      <p>
        Use <code>AsOrdered()</code> só quando precisa — a preservação tem custo. Se em meio à query você quer "soltar" a ordem, há <code>AsUnordered()</code>.
      </p>

      <h2>Controlando o paralelismo</h2>
      <p>
        Igual a <code>Parallel.For</code>, você pode limitar quantos núcleos serão usados:
      </p>
      <pre><code>{`var resultado = items
    .AsParallel()
    .WithDegreeOfParallelism(4)              // máximo 4 threads
    .WithExecutionMode(ParallelExecutionMode.ForceParallelism) // não decida sozinho
    .WithCancellation(cts.Token)             // suporte a cancelamento
    .Select(Processar)
    .ToList();`}</code></pre>
      <p>
        <code>WithExecutionMode(ForceParallelism)</code> diz ao runtime "rode em paralelo mesmo se acha que não vale a pena" — útil quando você sabe melhor que o heurístico.
      </p>

      <h2>Agregações: Sum, Aggregate, Count</h2>
      <p>
        Operadores de agregação ficam paralelos automaticamente quando vindos de <code>AsParallel</code>. Para agregações customizadas, há um <code>Aggregate</code> com sobrecargas paralelas:
      </p>
      <pre><code>{`int soma = numeros.AsParallel().Sum();
double media = notas.AsParallel().Average();

// Aggregate com seed local por thread (rápido)
long total = numeros.AsParallel().Aggregate(
    seed: 0L,
    func: (acc, n) => acc + n,
    resultSelector: x => x);`}</code></pre>

      <h2>Exceções em PLINQ</h2>
      <p>
        Como múltiplas threads podem lançar exceções <em>simultaneamente</em>, PLINQ embrulha tudo em uma <code>AggregateException</code>:
      </p>
      <pre><code>{`try
{
    var r = entrada.AsParallel().Select(Processar).ToList();
}
catch (AggregateException ag)
{
    foreach (var ex in ag.InnerExceptions)
        Console.WriteLine(ex.Message);
}`}</code></pre>
      <p>
        Diferente de <code>async/await</code> (que extrai a primeira exceção), aqui você precisa iterar <code>InnerExceptions</code>.
      </p>

      <AlertBox type="warning" title="ForEach paralelo dentro de query">
        Se você quer apenas executar uma ação para cada item (sem produzir nova coleção), prefira <code>Parallel.ForEach</code> — PLINQ é otimizado para <em>queries</em> que produzem resultados.
      </AlertBox>

      <h2>Side effects: cuidado triplo</h2>
      <p>
        Se o lambda escreve em variáveis externas, você caiu na mesma armadilha de <code>Parallel.For</code>:
      </p>
      <pre><code>{`int contador = 0;
var r = items.AsParallel().Where(x =>
{
    contador++; // BUG: race condition silenciosa
    return x > 10;
}).ToList();
// contador final será MENOR que items.Count`}</code></pre>
      <p>
        Use <code>Interlocked.Increment</code> ou refatore para que o lambda seja puro (sem side effects).
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>PLINQ em I/O:</strong> <code>.AsParallel().Select(url =&gt; http.GetString(url))</code> — bloqueia threads do pool. Use <code>Task.WhenAll</code>.</li>
        <li><strong>Esperar ordem sem <code>AsOrdered</code>:</strong> resultado vem embaralhado e leva a bugs sutis.</li>
        <li><strong>Coleção pequena:</strong> overhead supera ganho. Meça.</li>
        <li><strong>Side effects:</strong> race conditions. Lambdas devem ser puros.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>.AsParallel()</code> converte uma query LINQ em paralela.</li>
        <li>Use <code>AsOrdered()</code> para preservar ordem (com custo).</li>
        <li><code>WithDegreeOfParallelism</code> limita threads; <code>WithExecutionMode</code> força.</li>
        <li>Exceções vêm em <code>AggregateException</code>.</li>
        <li>PLINQ é para CPU-bound; nunca para I/O.</li>
        <li>Sempre <em>meça</em> antes de paralelizar.</li>
      </ul>
    </PageContainer>
  );
}
