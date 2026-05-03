import{j as e}from"./index-CzLAthD5.js";import{P as r,A as a}from"./AlertBox-CWJo3ar5.js";function l(){return e.jsxs(r,{title:"Parallel.For e Parallel.ForEach para CPU-bound",subtitle:"Paralelizando loops pesados com poucas linhas de código — e os cuidados que isso exige.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Há tarefas que ",e.jsx("em",{children:"não esperam"})," nada externo — elas só queimam CPU: aplicar filtro em milhares de imagens, calcular hash de muitos arquivos, processar pixels, simular física. Em código sequencial elas usam apenas ",e.jsx("strong",{children:"um núcleo"})," do seu processador, mesmo que sua máquina tenha 16. A classe ",e.jsx("strong",{children:"Parallel"})," (no namespace ",e.jsx("code",{children:"System.Threading.Tasks"}),") divide o trabalho automaticamente entre vários núcleos. É como passar de um pintor pintando uma parede para uma equipe inteira pintando trechos diferentes ao mesmo tempo."]}),e.jsx("h2",{children:"Parallel.For: range numérico"}),e.jsxs("p",{children:["A versão mais simples: troca um ",e.jsx("code",{children:"for (int i = 0; i < N; i++)"})," por uma versão paralela. O .NET particiona o intervalo entre os núcleos:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Threading.Tasks;

// Versão sequencial
for (int i = 0; i < imagens.Length; i++)
    AplicarFiltro(imagens[i]);

// Versão paralela
Parallel.For(0, imagens.Length, i =>
{
    AplicarFiltro(imagens[i]);
});`})}),e.jsxs("p",{children:["A assinatura é ",e.jsx("code",{children:"Parallel.For(início, fim, ação)"}),". O ",e.jsx("code",{children:"fim"})," é exclusivo (igual ao ",e.jsx("code",{children:"for"})," tradicional). A função recebe o índice atual."]}),e.jsx("h2",{children:"Parallel.ForEach: coleção qualquer"}),e.jsxs("p",{children:["Para iterar sobre ",e.jsx("code",{children:"IEnumerable<T>"})," (lista, array, resultado de LINQ), use ",e.jsx("code",{children:"ForEach"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var arquivos = Directory.EnumerateFiles("/dados", "*.bin");

Parallel.ForEach(arquivos, arquivo =>
{
    string hash = CalcularSha256(arquivo);
    Console.WriteLine($"{arquivo}: {hash}");
});`})}),e.jsxs("p",{children:["Por baixo dos panos, o particionador (",e.jsx("em",{children:"Partitioner"}),") divide a coleção em pedaços e despacha para threads do ThreadPool. Você não controla a ordem de execução — outra grande diferença em relação ao ",e.jsx("code",{children:"foreach"})," normal."]}),e.jsx("h2",{children:"Limitando o paralelismo"}),e.jsxs("p",{children:["Por padrão, ",e.jsx("code",{children:"Parallel"})," usa todos os núcleos lógicos. Em servidores compartilhados ou quando o trabalho usa um recurso limitado (banco de dados, GPU), você quer limitar:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var opcoes = new ParallelOptions
{
    MaxDegreeOfParallelism = 4,             // no máximo 4 threads simultâneas
    CancellationToken = ct                  // suporta cancelamento!
};

Parallel.ForEach(itens, opcoes, item =>
{
    Processar(item);
});`})}),e.jsxs(a,{type:"info",title:"Quantos núcleos eu tenho?",children:[e.jsx("code",{children:"Environment.ProcessorCount"})," retorna o número de processadores lógicos vistos pelo sistema. Em uma máquina i7 com hyperthreading, costuma ser 8 ou 16."]}),e.jsx("h2",{children:"Thread-safety: o calcanhar de Aquiles"}),e.jsxs("p",{children:["Quando vários threads rodam o mesmo lambda ao mesmo tempo, qualquer dado ",e.jsx("strong",{children:"compartilhado"})," vira problema. Veja este bug clássico:"]}),e.jsx("pre",{children:e.jsx("code",{children:`int total = 0;
Parallel.For(0, 1_000_000, i => total += 1);
// total NÃO será 1.000.000! Há corrida (race condition).`})}),e.jsxs("p",{children:["O operador ",e.jsx("code",{children:"+="})," não é atômico: ele lê, soma, escreve. Duas threads podem ler ao mesmo tempo e perder atualizações. Soluções:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// 1) Operação atômica
int total = 0;
Parallel.For(0, 1_000_000, i => Interlocked.Increment(ref total));

// 2) Acumulador local por thread (rápido — evita contenção)
long total = 0;
Parallel.For<long>(0, 1_000_000,
    () => 0L,                               // estado local inicial
    (i, state, local) => local + 1,         // acumula em local
    local => Interlocked.Add(ref total, local) // soma final
);`})}),e.jsx("h2",{children:"Coleções thread-safe"}),e.jsxs("p",{children:["Se você precisa adicionar resultados a uma coleção compartilhada, não use ",e.jsx("code",{children:"List<T>"})," — use ",e.jsx("code",{children:"ConcurrentBag<T>"}),", ",e.jsx("code",{children:"ConcurrentDictionary<K,V>"})," ou ",e.jsx("code",{children:"ConcurrentQueue<T>"})," do namespace ",e.jsx("code",{children:"System.Collections.Concurrent"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var resultados = new ConcurrentBag<string>();

Parallel.ForEach(arquivos, arq =>
{
    string r = ProcessarArquivo(arq);
    resultados.Add(r); // seguro entre threads
});`})}),e.jsxs(a,{type:"warning",title:"NÃO use Parallel para I/O",children:[e.jsx("code",{children:"Parallel.For"})," e ",e.jsx("code",{children:"ForEach"})," bloqueiam threads enquanto o lambda roda. Se o trabalho for esperar rede/disco, você está prendendo threads do pool — destruindo escala. Para I/O, use ",e.jsx("code",{children:"Task.WhenAll"})," ou ",e.jsx("code",{children:"Parallel.ForEachAsync"}),"."]}),e.jsx("h2",{children:"Parallel.ForEachAsync (.NET 6+)"}),e.jsxs("p",{children:["Para trabalho assíncrono em paralelo, surgiu ",e.jsx("code",{children:"Parallel.ForEachAsync"}),". Ele agenda lambdas ",e.jsx("code",{children:"async"})," respeitando o ",e.jsx("code",{children:"MaxDegreeOfParallelism"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var urls = new[] { "https://a.com", "https://b.com", "https://c.com" };
var http = new HttpClient();

await Parallel.ForEachAsync(urls,
    new ParallelOptions { MaxDegreeOfParallelism = 5 },
    async (url, ct) =>
    {
        string conteudo = await http.GetStringAsync(url, ct);
        Console.WriteLine($"{url}: {conteudo.Length}");
    });`})}),e.jsxs("p",{children:['Esse é o jeito moderno de "rodar N requisições simultâneas com limite". Antigamente o povo usava ',e.jsx("code",{children:"SemaphoreSlim"})," + ",e.jsx("code",{children:"Task.WhenAll"}),"; hoje basta isso."]}),e.jsx("h2",{children:"Quando o paralelismo não compensa"}),e.jsxs("p",{children:["Existe overhead em despachar trabalho para várias threads. Se cada item leva microssegundos, paralelizar pode ser ",e.jsx("em",{children:"mais lento"})," que sequencial. Regras de bolso:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"O trabalho de cada item leva pelo menos alguns milissegundos."}),e.jsx("li",{children:"A coleção tem milhares de itens (não dezenas)."}),e.jsx("li",{children:"O trabalho é CPU-bound, não I/O-bound."}),e.jsx("li",{children:"Você minimizou estado compartilhado e contenção."})]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Race conditions:"})," usar ",e.jsx("code",{children:"+="}),", ",e.jsx("code",{children:"List.Add"}),", ",e.jsx("code",{children:"Dictionary[k]="})," sem proteção. Use ",e.jsx("code",{children:"Interlocked"})," ou coleções concorrentes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Paralelizar I/O:"})," bloqueia threads do pool, causa starvation. Prefira ",e.jsx("code",{children:"Parallel.ForEachAsync"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Lambdas com side-effects de UI:"})," ",e.jsx("code",{children:"Parallel.For"})," roda em ThreadPool; mexer em controles dispara exceção."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar ordem:"})," a saída pode vir embaralhada. Se importa ordem, use o índice e ordene depois."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Parallel.For/ForEach"})," dividem trabalho CPU-bound entre núcleos automaticamente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ParallelOptions.MaxDegreeOfParallelism"})," limita o número de threads."]}),e.jsxs("li",{children:["Atenção a ",e.jsx("em",{children:"race conditions"}),": use ",e.jsx("code",{children:"Interlocked"}),", locks ou coleções concorrentes."]}),e.jsxs("li",{children:["Não use para I/O — use ",e.jsx("code",{children:"Parallel.ForEachAsync"})," ou ",e.jsx("code",{children:"Task.WhenAll"}),"."]}),e.jsx("li",{children:"Mensure: paralelismo só ajuda quando o trabalho por item é razoavelmente caro."})]})]})}export{l as default};
