import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Benchmarkdotnet() {
  return (
    <PageContainer
      title="BenchmarkDotNet: medindo performance com rigor"
      subtitle="Pare de usar Stopwatch ingenuamente — meça com warmup, estatística e diagnóstico de memória."
      difficulty="avancado"
      timeToRead="16 min"
    >
      <p>
        "Esse código é mais rápido?" Quase ninguém sabe responder direito. A intuição engana: o JIT precisa aquecer, o GC pode disparar no meio, o sistema operacional pode preemptar a thread, e você terminou medindo o ruído. <strong>BenchmarcDotNet (BDN)</strong> é a biblioteca padrão de microbenchmark em .NET. Ela isola o método sob teste, executa milhares de iterações em processos separados, descarta outliers e reporta com intervalo de confiança. Pense nela como um "laboratório esterilizado" para perguntas de performance — sem ela, você está medindo no meio do trânsito.
      </p>

      <h2>Por que <code>Stopwatch</code> sozinho não basta</h2>
      <pre><code>{`// RUIM — várias armadilhas
var sw = Stopwatch.StartNew();
for (int i = 0; i < 1_000_000; i++)
    Foo();
sw.Stop();
Console.WriteLine($"{sw.ElapsedMilliseconds} ms");`}</code></pre>
      <p>
        Problemas: (1) primeiro <em>iter</em> ainda pode estar no Tier 0 do JIT, lento; (2) o GC pode rodar no meio; (3) sem comparação base, o número não significa nada; (4) zero info sobre alocações. BDN resolve <em>todos</em> esses pontos automaticamente.
      </p>

      <h2>Setup: projeto separado</h2>
      <p>
        Benchmarks devem rodar em <strong>Release</strong>, sem debugger. Crie um projeto à parte:
      </p>
      <pre><code>{`mkdir MeuApp.Bench && cd MeuApp.Bench
dotnet new console
dotnet add package BenchmarkDotNet
dotnet add reference ../MeuApp/MeuApp.csproj`}</code></pre>
      <pre><code>{`// Program.cs
using BenchmarkDotNet.Running;
BenchmarkRunner.Run<MeusBenchmarks>();`}</code></pre>

      <h2>Anatomia de um benchmark</h2>
      <pre><code>{`using BenchmarkDotNet.Attributes;

[MemoryDiagnoser]               // mede alocações + GC gen0/1/2
[SimpleJob(warmupCount: 3, iterationCount: 5)]
public class MeusBenchmarks
{
    private string[] _entradas = null!;

    [GlobalSetup]
    public void Setup()
    {
        _entradas = Enumerable.Range(1, 1000)
            .Select(i => $"item-{i}")
            .ToArray();
    }

    [Benchmark(Baseline = true)]    // baseline = 1.00x; outros são comparados a este
    public string ConcatComMais()
    {
        var s = "";
        foreach (var e in _entradas) s += e;
        return s;
    }

    [Benchmark]
    public string ConcatComStringBuilder()
    {
        var sb = new StringBuilder();
        foreach (var e in _entradas) sb.Append(e);
        return sb.ToString();
    }

    [Benchmark]
    public string ConcatComStringJoin() => string.Concat(_entradas);
}`}</code></pre>
      <p>
        Rode com <code>dotnet run -c Release</code>. BDN vai compilar em modo Release, criar processos isolados por método, rodar warmup (~3 iterações descartadas), depois iterações de medição, e imprimir uma tabela.
      </p>

      <h2>Lendo o resultado</h2>
      <pre><code>{`|                  Method |       Mean |     Error |    StdDev | Ratio | Allocated |
|------------------------ |-----------:|----------:|----------:|------:|----------:|
|           ConcatComMais | 4,250.6 us |  82.30 us | 113.07 us |  1.00 |   4.71 MB |
|  ConcatComStringBuilder |    18.3 us |   0.36 us |   0.42 us |  0.00 |   24.4 KB |
|     ConcatComStringJoin |    12.1 us |   0.23 us |   0.34 us |  0.00 |   16.0 KB |`}</code></pre>
      <p>
        Colunas importantes: <strong>Mean</strong> (média do tempo), <strong>StdDev</strong> (desvio-padrão — quanto menor, mais confiável), <strong>Error</strong> (margem de erro estatística), <strong>Ratio</strong> (razão vs baseline) e <strong>Allocated</strong> (memória alocada por execução). Aqui o <code>+=</code> em string aloca <em>200x</em> mais memória que <code>StringBuilder</code> e é <em>230x</em> mais lento — porque cria uma string nova a cada concatenação.
      </p>

      <AlertBox type="info" title="Sempre olhe Allocated">
        Tempo é só metade da história. Em servidores, alocações disparam o GC, que para todas as threads. Um método "rápido" que aloca muito pode degradar a performance global da aplicação. <code>[MemoryDiagnoser]</code> deveria estar em todo benchmark.
      </AlertBox>

      <h2>Parametrização com <code>[Params]</code></h2>
      <p>
        Você quer saber se sua função se comporta diferente com 10 ou 10.000 itens? Não copie o método — parametrize:
      </p>
      <pre><code>{`public class BenchOrdenacao
{
    [Params(100, 1_000, 10_000)]
    public int N;

    private int[] _dados = null!;

    [IterationSetup]                 // roda antes de cada iteração
    public void Setup()
    {
        _dados = Enumerable.Range(0, N)
            .Select(_ => Random.Shared.Next())
            .ToArray();
    }

    [Benchmark]
    public void OrdenarArray() => Array.Sort(_dados);

    [Benchmark]
    public void OrdenarLinq() => _dados.OrderBy(x => x).ToArray();
}`}</code></pre>
      <p>
        BDN gera uma linha de resultado para cada combinação de parâmetro — perfeito para ver onde uma estratégia ganha e onde perde.
      </p>

      <h2>Múltiplos jobs: comparando runtimes</h2>
      <pre><code>{`[MemoryDiagnoser]
[SimpleJob(RuntimeMoniker.Net80)]
[SimpleJob(RuntimeMoniker.Net90)]
public class CompararRuntimes
{
    [Benchmark] public int Soma() => Enumerable.Range(1, 1000).Sum();
}`}</code></pre>
      <p>
        Você compara o mesmo código rodando em .NET 8 e .NET 9, lado a lado. Útil para validar ganhos de versões novas antes de migrar produção.
      </p>

      <AlertBox type="warning" title="Não confie em microbenchmarks isolados">
        Um método 10x mais rápido em isolamento pode ser irrelevante se ele já não é gargalo. Antes de otimizar, perfile a aplicação real (dotnet-trace, PerfView, Visual Studio Profiler) para descobrir <em>onde</em> o tempo é gasto. BDN responde "qual variante é mais rápida"; o profiler responde "vale a pena otimizar isso?".
      </AlertBox>

      <h2>Boas práticas de microbenchmark</h2>
      <p>
        Algumas regras para resultados confiáveis: feche apps pesados durante a medição (browser, IDE em build); rode em laptop ligado na tomada (CPU em modo "balanced" frita números); evite virtualização agressiva; sempre tenha um método <em>baseline</em> para contexto; reuse buffers em <code>[GlobalSetup]</code> em vez de alocar em cada iteração; verifique os <em>warnings</em> que BDN imprime no final (ele avisa se o desvio for alto).
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Rodar em Debug</strong> — assertions, sem otimização do JIT, números inúteis.</li>
        <li><strong>Esquecer de retornar valor</strong> do benchmark — o JIT pode eliminar o cálculo (dead code elimination). Sempre retorne para forçar o cálculo.</li>
        <li><strong>Setup pesado dentro do <code>[Benchmark]</code></strong> — você mede o setup, não o método.</li>
        <li><strong>Comparar valores absolutos entre máquinas</strong> — só compare na <em>mesma</em> máquina, na mesma execução.</li>
        <li><strong>Ignorar StdDev altíssimo</strong> — significa que ruído domina; refaça com mais iterações.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>BenchmarkDotNet isola o método e mede com rigor estatístico.</li>
        <li>Sempre rode em projeto separado, modo Release.</li>
        <li>Use <code>[MemoryDiagnoser]</code> para ver alocações além do tempo.</li>
        <li>Marque um benchmark como <code>Baseline</code> para comparações relativas.</li>
        <li>Microbenchmark responde "qual é mais rápido"; perfilamento responde "onde otimizar".</li>
      </ul>
    </PageContainer>
  );
}
