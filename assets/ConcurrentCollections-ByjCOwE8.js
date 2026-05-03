import{j as e}from"./index-CzLAthD5.js";import{P as a,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(a,{title:"Coleções concorrentes para multi-thread",subtitle:"ConcurrentDictionary, ConcurrentQueue, ConcurrentBag e BlockingCollection — coleções pensadas para várias threads ao mesmo tempo.",difficulty:"intermediario",timeToRead:"13 min",children:[e.jsxs("p",{children:['Imagine três caixas de supermercado tentando atualizar a mesma planilha de estoque ao mesmo tempo, sem combinar nada. O resultado seria caos: dois caixas leem "10 bananas", ambos vendem 1, ambos escrevem "9" — sumiu uma banana do registro. Em código, isso se chama ',e.jsx("strong",{children:"condição de corrida"}),", e acontece quando várias ",e.jsx("em",{children:"threads"})," (linhas de execução paralelas) tocam a mesma estrutura de dados sem coordenação. As ",e.jsx("strong",{children:"coleções concorrentes"})," de C# resolvem isso: elas vivem no namespace ",e.jsx("code",{children:"System.Collections.Concurrent"})," e são desenhadas para múltiplas threads sem precisar de ",e.jsx("code",{children:"lock"})," manual."]}),e.jsx("h2",{children:"O problema com Dictionary comum"}),e.jsxs("p",{children:["Um ",e.jsx("code",{children:"Dictionary<K,V>"})," tradicional não é seguro para uso paralelo. Duas threads escrevendo simultaneamente podem corromper a estrutura interna do hash e causar laço infinito ou exceções estranhas."]}),e.jsx("pre",{children:e.jsx("code",{children:`var contagem = new Dictionary<string, int>();

// PERIGOSO: várias tasks alterando o mesmo dicionário
Parallel.For(0, 1000, i =>
{
    var chave = (i % 10).ToString();
    if (contagem.ContainsKey(chave))
        contagem[chave]++;     // race condition aqui
    else
        contagem[chave] = 1;
});
// Resultado imprevisível ou exceção!`})}),e.jsx("h2",{children:"ConcurrentDictionary: a solução natural"}),e.jsxs("p",{children:[e.jsx("code",{children:"ConcurrentDictionary<K,V>"})," usa ",e.jsx("em",{children:"locking"}),' particionado internamente: ele divide o dicionário em vários "balcões" para que threads diferentes possam escrever em chaves diferentes sem se atrapalharem.']}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Concurrent;

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
    Console.WriteLine($"{k}: {v}"); // 100, 100, 100, ...`})}),e.jsx("h2",{children:"GetOrAdd: idempotência elegante"}),e.jsxs("p",{children:['Um padrão comum é "se a chave existir, devolva o valor; senão, calcule e insira agora". Em código não-concorrente, isso vira um ',e.jsx("code",{children:"if"}),". Em código concorrente, as duas threads podem cair no ",e.jsx("code",{children:"if"})," ao mesmo tempo e calcular duas vezes. ",e.jsx("code",{children:"GetOrAdd"})," resolve com uma operação atômica:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var cache = new ConcurrentDictionary<string, byte[]>();

byte[] CarregarArquivo(string caminho)
{
    return cache.GetOrAdd(caminho, p =>
    {
        // factory só executa se a chave ainda não existe
        Console.WriteLine($"Lendo {p} do disco...");
        return File.ReadAllBytes(p);
    });
}`})}),e.jsxs(r,{type:"warning",title:"Factory de GetOrAdd pode rodar mais de uma vez",children:["Se duas threads chamam ",e.jsx("code",{children:"GetOrAdd"})," para a mesma chave inexistente ",e.jsx("em",{children:"ao mesmo tempo"}),", a factory pode executar mais de uma vez — só uma das saídas será mantida. Para operações caras ou com efeitos colaterais (I/O, escrita), use ",e.jsx("code",{children:"Lazy<T>"})," como valor para garantir execução única."]}),e.jsx("h2",{children:"ConcurrentQueue e ConcurrentStack"}),e.jsx("p",{children:'Versões thread-safe de Queue e Stack. Métodos clássicos viraram "Try":'}),e.jsx("pre",{children:e.jsx("code",{children:`var fila = new ConcurrentQueue<string>();
fila.Enqueue("tarefa-1");
fila.Enqueue("tarefa-2");

if (fila.TryDequeue(out var item))
    Console.WriteLine($"Processando {item}");

var pilha = new ConcurrentStack<int>();
pilha.Push(10);
pilha.PushRange(new[] { 20, 30, 40 }); // empilha vários atomicamente

if (pilha.TryPop(out var topo))
    Console.WriteLine(topo); // 40`})}),e.jsx("h2",{children:"ConcurrentBag: quando ordem não importa"}),e.jsxs("p",{children:[e.jsx("code",{children:"ConcurrentBag<T>"}),' é uma "sacola" sem ordem garantida. Otimizada para o cenário em que cada thread adiciona ',e.jsx("em",{children:"e"})," consome itens (ela mantém uma sacolinha por thread). Se você só consome de fora, prefira ",e.jsx("code",{children:"ConcurrentQueue"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`var resultados = new ConcurrentBag<int>();

Parallel.For(1, 1001, i =>
{
    int quadrado = i * i;
    resultados.Add(quadrado);
});

Console.WriteLine($"Total: {resultados.Count}");        // 1000
Console.WriteLine($"Soma: {resultados.Sum()}");`})}),e.jsx("h2",{children:"BlockingCollection: produtor-consumidor"}),e.jsxs("p",{children:[e.jsx("code",{children:"BlockingCollection<T>"})," é um wrapper que ",e.jsx("em",{children:"bloqueia"})," consumidores quando está vazia e (opcionalmente) bloqueia produtores quando enche. É a ferramenta clássica para o padrão ",e.jsx("strong",{children:"produtor-consumidor"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// Capacidade máxima de 5 itens (back-pressure)
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

await Task.WhenAll(produtor, consumidor);`})}),e.jsxs(r,{type:"info",title:"Channels: a alternativa moderna",children:["Em código novo, considere também ",e.jsx("code",{children:"System.Threading.Channels"})," (Channel<T>) — uma API mais moderna, async-first, frequentemente mais performática que BlockingCollection para o mesmo padrão produtor-consumidor."]}),e.jsx("h2",{children:"Quando usar lock comum em vez disso"}),e.jsxs("p",{children:["Coleções concorrentes têm overhead. Para casos simples — pouca contenção, poucas threads — um ",e.jsx("code",{children:"lock"})," em torno de uma ",e.jsx("code",{children:"List"})," ou ",e.jsx("code",{children:"Dictionary"})," normal pode ser mais rápido e mais legível:"]}),e.jsx("pre",{children:e.jsx("code",{children:`var lista = new List<string>();
var trava = new object();

void AdicionarSeguro(string item)
{
    lock (trava)
    {
        lista.Add(item);
    }
}`})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Achar que ",e.jsx("code",{children:"foreach"}),' em ConcurrentDictionary tira "snapshot consistente"']}),": ele percorre uma versão consistente, mas inserções concorrentes podem ou não aparecer."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Confiar que ",e.jsx("code",{children:"Count"})," é exato"]}),": em coleções concorrentes, ",e.jsx("code",{children:"Count"})," é uma aproximação no momento da leitura. Pode mudar entre duas chamadas."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"CompleteAdding"})]})," em BlockingCollection: o consumidor fica preso eternamente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar ConcurrentBag quando ordem importa"}),": ela é otimizada para fonte = consumidor; ordem é arbitrária."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Dictionary/List comuns NÃO são seguros para multi-thread."}),e.jsxs("li",{children:[e.jsx("code",{children:"ConcurrentDictionary"})," com ",e.jsx("code",{children:"AddOrUpdate"})," e ",e.jsx("code",{children:"GetOrAdd"})," resolve a maioria dos casos."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ConcurrentQueue/Stack"}),' têm versões "Try" para todas as operações.']}),e.jsxs("li",{children:[e.jsx("code",{children:"BlockingCollection"})," implementa produtor-consumidor com bloqueio."]}),e.jsxs("li",{children:["Para concorrência leve, um ",e.jsx("code",{children:"lock"})," simples pode ser melhor."]})]})]})}export{i as default};
