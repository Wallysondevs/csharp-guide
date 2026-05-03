import{j as e}from"./index-CzLAthD5.js";import{P as a,A as r}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(a,{title:"async streams: IAsyncEnumerable<T> e await foreach",subtitle:"Iterando sobre dados que chegam aos poucos — sem carregar tudo em memória.",difficulty:"avancado",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine ler um livro que ainda está sendo escrito: você lê o capítulo 1 enquanto o autor digita o 2. Não faz sentido esperar o livro inteiro pronto para começar. Em programação, vivemos isso o tempo todo: receber linhas de um arquivo enorme, páginas de uma API REST, eventos de um sensor, registros de um banco de dados. Antes do C# 8, tínhamos duas opções ruins: 1) carregar tudo numa ",e.jsx("code",{children:"List<T>"})," em memória (estoura RAM), ou 2) usar ",e.jsx("code",{children:"IEnumerable<T>"})," com chamadas ",e.jsx("em",{children:"bloqueantes"})," dentro do iterador (trava thread). O C# 8 introduziu ",e.jsx("strong",{children:"async streams"})," — a combinação de ",e.jsx("code",{children:"IAsyncEnumerable<T>"}),", ",e.jsx("code",{children:"yield return"})," em métodos ",e.jsx("code",{children:"async"}),", e ",e.jsx("code",{children:"await foreach"})," no consumidor. É iteração preguiçosa ",e.jsx("em",{children:"e"})," assíncrona ao mesmo tempo."]}),e.jsx("h2",{children:"Produzindo um async stream"}),e.jsxs("p",{children:["Você marca o método como ",e.jsx("code",{children:"async"}),", declara o tipo de retorno como ",e.jsx("code",{children:"IAsyncEnumerable<T>"}),", e usa ",e.jsx("code",{children:"yield return"})," para emitir valores e ",e.jsx("code",{children:"await"})," entre eles:"]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Collections.Generic;
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
}`})}),e.jsxs("p",{children:["Compilação: o C# transforma esse método numa ",e.jsx("em",{children:"state machine"})," que combina o iterador (de ",e.jsx("code",{children:"yield"}),") com a máquina de async (de ",e.jsx("code",{children:"await"}),"). Você não vê isso — só usa."]}),e.jsx("h2",{children:"Consumindo com await foreach"}),e.jsxs("p",{children:["Do outro lado, em vez de ",e.jsx("code",{children:"foreach"}),", use ",e.jsx("code",{children:"await foreach"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`await foreach (string linha in LerLinhasAsync("dados.csv"))
{
    Console.WriteLine(linha);
    if (linha.StartsWith("FIM")) break;
}`})}),e.jsxs("p",{children:["A cada iteração, o runtime espera o próximo item assincronamente — sem bloquear thread, sem alocar lista. Você pode ",e.jsx("code",{children:"break"})," a qualquer momento; o restante do arquivo nunca é lido."]}),e.jsxs(r,{type:"info",title:"Diferença para Task<List<T>>",children:["Um método ",e.jsx("code",{children:"async Task<List<Linha>> LerTudoAsync()"})," precisa terminar de ler tudo antes de devolver — bloqueia memória e adia o primeiro resultado. Um ",e.jsx("code",{children:"IAsyncEnumerable<Linha>"})," entrega itens conforme chegam, com memória mínima."]}),e.jsx("h2",{children:"Exemplo prático: paginação de API"}),e.jsxs("p",{children:["Caso clássico — uma API REST devolve dados em páginas (",e.jsx("code",{children:"?page=1"}),", ",e.jsx("code",{children:"?page=2"}),"...). Você quer iterar todos os registros como se fossem um único stream:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public async IAsyncEnumerable<Pedido> ObterTodosPedidosAsync(
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
}`})}),e.jsx("p",{children:"Você nunca tem mais de uma página em memória. O consumidor pode parar a qualquer hora — e nenhuma página extra é baixada."}),e.jsx("h2",{children:"Cancellation com [EnumeratorCancellation]"}),e.jsxs("p",{children:["Note o atributo ",e.jsx("code",{children:"[EnumeratorCancellation]"})," no parâmetro acima. Ele é necessário porque, quando você usa ",e.jsx("code",{children:"WithCancellation(ct)"}),' no consumidor, o token precisa "fluir" para o parâmetro do método produtor:']}),e.jsx("pre",{children:e.jsx("code",{children:`// Sem o atributo, esse 'ct' fica ignorado quando o caller faz WithCancellation
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
catch (OperationCanceledException) { Console.WriteLine("Parou."); }`})}),e.jsx("h2",{children:"Comparação: async stream vs List + await"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Aspecto"}),e.jsx("th",{children:"Task<List<T>>"}),e.jsx("th",{children:"IAsyncEnumerable<T>"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Primeiro item"}),e.jsx("td",{children:"Só ao final"}),e.jsx("td",{children:"Imediato"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Memória"}),e.jsx("td",{children:"Toda a coleção"}),e.jsx("td",{children:"Item a item"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"break early"}),e.jsx("td",{children:"Inútil (já carregou)"}),e.jsx("td",{children:"Para de processar"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"API"}),e.jsx("td",{children:"Madura, simples"}),e.jsx("td",{children:"C# 8+ apenas"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Composição LINQ"}),e.jsx("td",{children:"LINQ normal"}),e.jsx("td",{children:e.jsx("code",{children:"System.Linq.Async"})})]})]})]}),e.jsx("h2",{children:"LINQ assíncrono"}),e.jsxs("p",{children:["O pacote NuGet ",e.jsx("code",{children:"System.Linq.Async"})," traz ",e.jsx("code",{children:"WhereAwait"}),", ",e.jsx("code",{children:"SelectAwait"}),", ",e.jsx("code",{children:"FirstAsync"}),", ",e.jsx("code",{children:"ToListAsync"})," e amigos para ",e.jsx("code",{children:"IAsyncEnumerable<T>"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var grandes = await ObterTodosPedidosAsync()
    .Where(p => p.Total > 1000)
    .Take(50)
    .ToListAsync();`})}),e.jsx("h2",{children:"Configurando ConfigureAwait"}),e.jsxs("p",{children:["Em código de biblioteca, você pode controlar o ",e.jsx("code",{children:"ConfigureAwait"})," de cada ",e.jsx("code",{children:"await"})," dentro do ",e.jsx("code",{children:"foreach"})," com ",e.jsx("code",{children:".ConfigureAwait(false)"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`await foreach (var item in stream.ConfigureAwait(false))
{
    Processar(item);
}`})}),e.jsxs(r,{type:"warning",title:"Não use Task.WhenAll com IAsyncEnumerable",children:["Async streams são, por natureza, sequenciais. Se você quer paralelismo (ex.: processar páginas em paralelo), use ",e.jsx("code",{children:"Channel"})," ou ",e.jsx("code",{children:"Parallel.ForEachAsync"}),"."]}),e.jsx("h2",{children:"Quando preferir async stream"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Dados que ",e.jsx("em",{children:"chegam"})," em pedaços (rede, arquivo, sensor)."]}),e.jsx("li",{children:"Você não sabe quantos itens virão (talvez infinito)."}),e.jsx("li",{children:"Memória é restrita ou itens são grandes."}),e.jsx("li",{children:"O consumidor pode parar antes do fim."})]}),e.jsxs("p",{children:["Se você sempre precisa de todos os itens em memória de uma vez (ex.: para ordenar globalmente), uma ",e.jsx("code",{children:"Task<List<T>>"})," ainda é mais simples."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"[EnumeratorCancellation]"}),":"]})," ",e.jsx("code",{children:"WithCancellation"})," no caller não cancela nada dentro do produtor."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Misturar ",e.jsx("code",{children:"foreach"})," com ",e.jsx("code",{children:"IAsyncEnumerable"}),":"]})," não compila. Use ",e.jsx("code",{children:"await foreach"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Acumular o stream em lista por hábito:"})," derrota o propósito. Itere preguiçosamente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esperar paralelismo:"})," async stream é sequencial. Use Channels ou ParallelForEachAsync para concorrência."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"IAsyncEnumerable<T>"})," = sequência preguiçosa ",e.jsx("em",{children:"e"})," assíncrona."]}),e.jsxs("li",{children:["Produza com ",e.jsx("code",{children:"async"})," + ",e.jsx("code",{children:"yield return"})," + ",e.jsx("code",{children:"await"}),"."]}),e.jsxs("li",{children:["Consuma com ",e.jsx("code",{children:"await foreach"}),"."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"[EnumeratorCancellation]"})," para integrar ",e.jsx("code",{children:"CancellationToken"}),"."]}),e.jsxs("li",{children:["Evite carregar tudo em ",e.jsx("code",{children:"List<T>"})," quando não precisa — economize memória e latência."]}),e.jsxs("li",{children:[e.jsx("code",{children:"System.Linq.Async"})," traz operadores LINQ para esses streams."]})]})]})}export{o as default};
