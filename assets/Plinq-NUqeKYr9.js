import{j as e}from"./index-CzLAthD5.js";import{P as a,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(a,{title:"PLINQ: paralelizando consultas LINQ",subtitle:"Como transformar uma query LINQ sequencial em uma versão multi-core com uma única linha.",difficulty:"avancado",timeToRead:"11 min",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"LINQ"})," (Language Integrated Query) é o sistema de consultas embutido no C# — aquele ",e.jsx("code",{children:"numeros.Where(x => x > 10).Select(...)"}),". ",e.jsx("strong",{children:"PLINQ"})," é a versão paralela: ",e.jsx("em",{children:"Parallel LINQ"}),". A ideia é genial: você adiciona ",e.jsx("code",{children:".AsParallel()"})," em qualquer ponto da consulta e o motor distribui o trabalho entre os núcleos do processador. Sintaticamente é quase igual; por baixo, ele particiona a coleção, processa em paralelo e reúne os resultados. Pense numa biblioteca onde, em vez de um bibliotecário catalogar 10 mil livros, dez bibliotecários catalogam mil cada — terminando em 1/10 do tempo."]}),e.jsx("h2",{children:"De LINQ para PLINQ: uma linha de diferença"}),e.jsx("p",{children:"Veja o antes e depois:"}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Linq;

// LINQ sequencial
var primos = numeros
    .Where(n => EhPrimo(n))   // EhPrimo é caro: testa divisibilidade
    .ToList();

// PLINQ — distribui Where entre vários núcleos
var primosPar = numeros
    .AsParallel()
    .Where(n => EhPrimo(n))
    .ToList();`})}),e.jsxs("p",{children:[e.jsx("code",{children:".AsParallel()"})," retorna um ",e.jsx("code",{children:"ParallelQuery<T>"}),", e dali em diante todos os operadores LINQ rodam em sua versão paralela. A coleção é particionada (em pedaços iguais ou dinâmicos), e cada núcleo processa um pedaço."]}),e.jsx("h2",{children:"Quando PLINQ ajuda"}),e.jsx("p",{children:"PLINQ não é mágica. Há custo de coordenação entre threads. Ele compensa quando:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Trabalho por item é caro"}),": ",e.jsx("code",{children:"EhPrimo"}),", decodificação de imagem, parsing de XML grande. Para somar inteiros, paralelismo só atrapalha."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Coleção é grande"}),": dezenas de milhares de itens em diante."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"É CPU-bound"}),": nada de chamadas HTTP/banco. Para I/O, use async/await."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não há dependência entre itens"}),": cada item processado de forma independente."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`var primosGrandes = Enumerable.Range(2, 10_000_000)
    .AsParallel()
    .Where(EhPrimo)
    .Count();`})}),e.jsxs(r,{type:"info",title:"Sempre meça",children:["Em coleções pequenas ou trabalho leve, PLINQ é ",e.jsx("em",{children:"mais lento"})," que LINQ comum por causa do overhead de particionamento. Use ",e.jsx("code",{children:"Stopwatch"})," ou benchmarks (BenchmarkDotNet) antes de assumir ganho."]}),e.jsx("h2",{children:"Ordem dos resultados"}),e.jsxs("p",{children:["Por padrão, PLINQ ",e.jsx("strong",{children:"não preserva a ordem"})," da entrada. Ele entrega resultados conforme cada partição termina. Para algumas queries (contagens, somas) isso não importa; para outras (filtrar mantendo posição) importa muito:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Sem AsOrdered — resultado pode vir embaralhado
var ids = registros
    .AsParallel()
    .Where(r => r.Ativo)
    .Select(r => r.Id);

// Com AsOrdered — ordem original preservada (custa um pouco mais)
var idsEmOrdem = registros
    .AsParallel()
    .AsOrdered()
    .Where(r => r.Ativo)
    .Select(r => r.Id);`})}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"AsOrdered()"}),' só quando precisa — a preservação tem custo. Se em meio à query você quer "soltar" a ordem, há ',e.jsx("code",{children:"AsUnordered()"}),"."]}),e.jsx("h2",{children:"Controlando o paralelismo"}),e.jsxs("p",{children:["Igual a ",e.jsx("code",{children:"Parallel.For"}),", você pode limitar quantos núcleos serão usados:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var resultado = items
    .AsParallel()
    .WithDegreeOfParallelism(4)              // máximo 4 threads
    .WithExecutionMode(ParallelExecutionMode.ForceParallelism) // não decida sozinho
    .WithCancellation(cts.Token)             // suporte a cancelamento
    .Select(Processar)
    .ToList();`})}),e.jsxs("p",{children:[e.jsx("code",{children:"WithExecutionMode(ForceParallelism)"}),' diz ao runtime "rode em paralelo mesmo se acha que não vale a pena" — útil quando você sabe melhor que o heurístico.']}),e.jsx("h2",{children:"Agregações: Sum, Aggregate, Count"}),e.jsxs("p",{children:["Operadores de agregação ficam paralelos automaticamente quando vindos de ",e.jsx("code",{children:"AsParallel"}),". Para agregações customizadas, há um ",e.jsx("code",{children:"Aggregate"})," com sobrecargas paralelas:"]}),e.jsx("pre",{children:e.jsx("code",{children:`int soma = numeros.AsParallel().Sum();
double media = notas.AsParallel().Average();

// Aggregate com seed local por thread (rápido)
long total = numeros.AsParallel().Aggregate(
    seed: 0L,
    func: (acc, n) => acc + n,
    resultSelector: x => x);`})}),e.jsx("h2",{children:"Exceções em PLINQ"}),e.jsxs("p",{children:["Como múltiplas threads podem lançar exceções ",e.jsx("em",{children:"simultaneamente"}),", PLINQ embrulha tudo em uma ",e.jsx("code",{children:"AggregateException"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`try
{
    var r = entrada.AsParallel().Select(Processar).ToList();
}
catch (AggregateException ag)
{
    foreach (var ex in ag.InnerExceptions)
        Console.WriteLine(ex.Message);
}`})}),e.jsxs("p",{children:["Diferente de ",e.jsx("code",{children:"async/await"})," (que extrai a primeira exceção), aqui você precisa iterar ",e.jsx("code",{children:"InnerExceptions"}),"."]}),e.jsxs(r,{type:"warning",title:"ForEach paralelo dentro de query",children:["Se você quer apenas executar uma ação para cada item (sem produzir nova coleção), prefira ",e.jsx("code",{children:"Parallel.ForEach"})," — PLINQ é otimizado para ",e.jsx("em",{children:"queries"})," que produzem resultados."]}),e.jsx("h2",{children:"Side effects: cuidado triplo"}),e.jsxs("p",{children:["Se o lambda escreve em variáveis externas, você caiu na mesma armadilha de ",e.jsx("code",{children:"Parallel.For"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`int contador = 0;
var r = items.AsParallel().Where(x =>
{
    contador++; // BUG: race condition silenciosa
    return x > 10;
}).ToList();
// contador final será MENOR que items.Count`})}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"Interlocked.Increment"})," ou refatore para que o lambda seja puro (sem side effects)."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"PLINQ em I/O:"})," ",e.jsx("code",{children:".AsParallel().Select(url => http.GetString(url))"})," — bloqueia threads do pool. Use ",e.jsx("code",{children:"Task.WhenAll"}),"."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esperar ordem sem ",e.jsx("code",{children:"AsOrdered"}),":"]})," resultado vem embaralhado e leva a bugs sutis."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Coleção pequena:"})," overhead supera ganho. Meça."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Side effects:"})," race conditions. Lambdas devem ser puros."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:".AsParallel()"})," converte uma query LINQ em paralela."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"AsOrdered()"})," para preservar ordem (com custo)."]}),e.jsxs("li",{children:[e.jsx("code",{children:"WithDegreeOfParallelism"})," limita threads; ",e.jsx("code",{children:"WithExecutionMode"})," força."]}),e.jsxs("li",{children:["Exceções vêm em ",e.jsx("code",{children:"AggregateException"}),"."]}),e.jsx("li",{children:"PLINQ é para CPU-bound; nunca para I/O."}),e.jsxs("li",{children:["Sempre ",e.jsx("em",{children:"meça"})," antes de paralelizar."]})]})]})}export{i as default};
