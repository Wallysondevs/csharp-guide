import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(o,{title:"BenchmarkDotNet: medindo performance com rigor",subtitle:"Pare de usar Stopwatch ingenuamente — meça com warmup, estatística e diagnóstico de memória.",difficulty:"avancado",timeToRead:"16 min",children:[e.jsxs("p",{children:['"Esse código é mais rápido?" Quase ninguém sabe responder direito. A intuição engana: o JIT precisa aquecer, o GC pode disparar no meio, o sistema operacional pode preemptar a thread, e você terminou medindo o ruído. ',e.jsx("strong",{children:"BenchmarcDotNet (BDN)"}),' é a biblioteca padrão de microbenchmark em .NET. Ela isola o método sob teste, executa milhares de iterações em processos separados, descarta outliers e reporta com intervalo de confiança. Pense nela como um "laboratório esterilizado" para perguntas de performance — sem ela, você está medindo no meio do trânsito.']}),e.jsxs("h2",{children:["Por que ",e.jsx("code",{children:"Stopwatch"})," sozinho não basta"]}),e.jsx("pre",{children:e.jsx("code",{children:`// RUIM — várias armadilhas
var sw = Stopwatch.StartNew();
for (int i = 0; i < 1_000_000; i++)
    Foo();
sw.Stop();
Console.WriteLine($"{sw.ElapsedMilliseconds} ms");`})}),e.jsxs("p",{children:["Problemas: (1) primeiro ",e.jsx("em",{children:"iter"})," ainda pode estar no Tier 0 do JIT, lento; (2) o GC pode rodar no meio; (3) sem comparação base, o número não significa nada; (4) zero info sobre alocações. BDN resolve ",e.jsx("em",{children:"todos"})," esses pontos automaticamente."]}),e.jsx("h2",{children:"Setup: projeto separado"}),e.jsxs("p",{children:["Benchmarks devem rodar em ",e.jsx("strong",{children:"Release"}),", sem debugger. Crie um projeto à parte:"]}),e.jsx("pre",{children:e.jsx("code",{children:`mkdir MeuApp.Bench && cd MeuApp.Bench
dotnet new console
dotnet add package BenchmarkDotNet
dotnet add reference ../MeuApp/MeuApp.csproj`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
using BenchmarkDotNet.Running;
BenchmarkRunner.Run<MeusBenchmarks>();`})}),e.jsx("h2",{children:"Anatomia de um benchmark"}),e.jsx("pre",{children:e.jsx("code",{children:`using BenchmarkDotNet.Attributes;

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
}`})}),e.jsxs("p",{children:["Rode com ",e.jsx("code",{children:"dotnet run -c Release"}),". BDN vai compilar em modo Release, criar processos isolados por método, rodar warmup (~3 iterações descartadas), depois iterações de medição, e imprimir uma tabela."]}),e.jsx("h2",{children:"Lendo o resultado"}),e.jsx("pre",{children:e.jsx("code",{children:`|                  Method |       Mean |     Error |    StdDev | Ratio | Allocated |
|------------------------ |-----------:|----------:|----------:|------:|----------:|
|           ConcatComMais | 4,250.6 us |  82.30 us | 113.07 us |  1.00 |   4.71 MB |
|  ConcatComStringBuilder |    18.3 us |   0.36 us |   0.42 us |  0.00 |   24.4 KB |
|     ConcatComStringJoin |    12.1 us |   0.23 us |   0.34 us |  0.00 |   16.0 KB |`})}),e.jsxs("p",{children:["Colunas importantes: ",e.jsx("strong",{children:"Mean"})," (média do tempo), ",e.jsx("strong",{children:"StdDev"})," (desvio-padrão — quanto menor, mais confiável), ",e.jsx("strong",{children:"Error"})," (margem de erro estatística), ",e.jsx("strong",{children:"Ratio"})," (razão vs baseline) e ",e.jsx("strong",{children:"Allocated"})," (memória alocada por execução). Aqui o ",e.jsx("code",{children:"+="})," em string aloca ",e.jsx("em",{children:"200x"})," mais memória que ",e.jsx("code",{children:"StringBuilder"})," e é ",e.jsx("em",{children:"230x"})," mais lento — porque cria uma string nova a cada concatenação."]}),e.jsxs(r,{type:"info",title:"Sempre olhe Allocated",children:['Tempo é só metade da história. Em servidores, alocações disparam o GC, que para todas as threads. Um método "rápido" que aloca muito pode degradar a performance global da aplicação. ',e.jsx("code",{children:"[MemoryDiagnoser]"})," deveria estar em todo benchmark."]}),e.jsxs("h2",{children:["Parametrização com ",e.jsx("code",{children:"[Params]"})]}),e.jsx("p",{children:"Você quer saber se sua função se comporta diferente com 10 ou 10.000 itens? Não copie o método — parametrize:"}),e.jsx("pre",{children:e.jsx("code",{children:`public class BenchOrdenacao
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
}`})}),e.jsx("p",{children:"BDN gera uma linha de resultado para cada combinação de parâmetro — perfeito para ver onde uma estratégia ganha e onde perde."}),e.jsx("h2",{children:"Múltiplos jobs: comparando runtimes"}),e.jsx("pre",{children:e.jsx("code",{children:`[MemoryDiagnoser]
[SimpleJob(RuntimeMoniker.Net80)]
[SimpleJob(RuntimeMoniker.Net90)]
public class CompararRuntimes
{
    [Benchmark] public int Soma() => Enumerable.Range(1, 1000).Sum();
}`})}),e.jsx("p",{children:"Você compara o mesmo código rodando em .NET 8 e .NET 9, lado a lado. Útil para validar ganhos de versões novas antes de migrar produção."}),e.jsxs(r,{type:"warning",title:"Não confie em microbenchmarks isolados",children:["Um método 10x mais rápido em isolamento pode ser irrelevante se ele já não é gargalo. Antes de otimizar, perfile a aplicação real (dotnet-trace, PerfView, Visual Studio Profiler) para descobrir ",e.jsx("em",{children:"onde"}),' o tempo é gasto. BDN responde "qual variante é mais rápida"; o profiler responde "vale a pena otimizar isso?".']}),e.jsx("h2",{children:"Boas práticas de microbenchmark"}),e.jsxs("p",{children:['Algumas regras para resultados confiáveis: feche apps pesados durante a medição (browser, IDE em build); rode em laptop ligado na tomada (CPU em modo "balanced" frita números); evite virtualização agressiva; sempre tenha um método ',e.jsx("em",{children:"baseline"})," para contexto; reuse buffers em ",e.jsx("code",{children:"[GlobalSetup]"})," em vez de alocar em cada iteração; verifique os ",e.jsx("em",{children:"warnings"})," que BDN imprime no final (ele avisa se o desvio for alto)."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Rodar em Debug"})," — assertions, sem otimização do JIT, números inúteis."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de retornar valor"})," do benchmark — o JIT pode eliminar o cálculo (dead code elimination). Sempre retorne para forçar o cálculo."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Setup pesado dentro do ",e.jsx("code",{children:"[Benchmark]"})]})," — você mede o setup, não o método."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Comparar valores absolutos entre máquinas"})," — só compare na ",e.jsx("em",{children:"mesma"})," máquina, na mesma execução."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Ignorar StdDev altíssimo"})," — significa que ruído domina; refaça com mais iterações."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"BenchmarkDotNet isola o método e mede com rigor estatístico."}),e.jsx("li",{children:"Sempre rode em projeto separado, modo Release."}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"[MemoryDiagnoser]"})," para ver alocações além do tempo."]}),e.jsxs("li",{children:["Marque um benchmark como ",e.jsx("code",{children:"Baseline"})," para comparações relativas."]}),e.jsx("li",{children:'Microbenchmark responde "qual é mais rápido"; perfilamento responde "onde otimizar".'})]})]})}export{i as default};
