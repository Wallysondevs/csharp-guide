import{j as e}from"./index-CzLAthD5.js";import{P as s,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(s,{title:"ValueTask<T>: async sem alocar",subtitle:"Quando todo nanossegundo conta e a maioria das chamadas retorna na hora, a Task vira um peso. Conheça a alternativa que mora na pilha.",difficulty:"avancado",timeToRead:"14 min",children:[e.jsxs("p",{children:["Toda vez que você marca um método como ",e.jsx("code",{children:"async"})," e o tipo de retorno é ",e.jsx("code",{children:"Task<int>"}),", o runtime ",e.jsx("em",{children:"aloca"})," um objeto ",e.jsx("code",{children:"Task"})," no ",e.jsx("strong",{children:"heap"})," (a área de memória onde vivem os objetos administrados pelo coletor de lixo, o ",e.jsx("strong",{children:"Garbage Collector"})," ou GC). Para a maioria das aplicações, isso é insignificante. Mas se um método assíncrono é chamado ",e.jsx("strong",{children:"milhões de vezes por segundo"})," — pense em um cache, num parser de rede, num loop quente de um servidor web — essas alocações viram lixo, viram pausas de GC, viram latência. A ",e.jsx("code",{children:"ValueTask<T>"})," existe para esse cenário."]}),e.jsx("h2",{children:"O problema: cada async aloca"}),e.jsxs("p",{children:["Imagine que você escreve um método ",e.jsx("code",{children:"GetUserAsync"}),". Ele primeiro tenta um cache em memória; só se o cache não tiver o valor, vai ao banco de dados. Em produção, 99% das chamadas são ",e.jsx("em",{children:"cache hit"})," — voltam imediatamente, sem nenhuma operação realmente assíncrona. Ainda assim, com ",e.jsx("code",{children:"Task<T>"}),", cada chamada cria um objeto novo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public async Task<User> GetUserAsync(int id)
{
    if (_cache.TryGetValue(id, out var user))
        return user;          // 99% dos casos — síncrono

    return await _db.LoadAsync(id);
}`})}),e.jsxs("p",{children:["O compilador transforma esse método numa máquina de estados. Mesmo no caminho rápido, ele aloca um ",e.jsx("code",{children:"Task<User>"})," só para devolver o valor. Em hot path, isso pressiona o GC."]}),e.jsx("h2",{children:"A solução: ValueTask é uma struct"}),e.jsxs("p",{children:[e.jsx("code",{children:"ValueTask<T>"})," é um ",e.jsx("strong",{children:"struct"})," (tipo de valor, vive na pilha) que pode estar em um de três estados: já tem o resultado pronto (síncrono), embrulha uma ",e.jsx("code",{children:"Task"})," de verdade (assíncrono), ou aponta para um ",e.jsx("code",{children:"IValueTaskSource"})," reutilizável. No caminho rápido, nenhuma alocação acontece."]}),e.jsx("pre",{children:e.jsx("code",{children:`public ValueTask<User> GetUserAsync(int id)
{
    if (_cache.TryGetValue(id, out var user))
        return new ValueTask<User>(user);  // sem alocar nada

    return new ValueTask<User>(_db.LoadAsync(id));
}`})}),e.jsxs("p",{children:["Repare que o método não é mais ",e.jsx("code",{children:"async"})," — usamos ",e.jsx("code",{children:"async"})," só quando precisamos de fato de ",e.jsx("code",{children:"await"}),". Aqui devolvemos manualmente uma ",e.jsx("code",{children:"ValueTask"})," envolvendo o valor já pronto."]}),e.jsxs(a,{type:"info",title:"Quando usar ValueTask",children:["Use ",e.jsx("code",{children:"ValueTask<T>"})," quando o método (1) é chamado em hot path, e (2) ",e.jsx("strong",{children:"frequentemente retorna sincronamente"}),". Se ele quase sempre faz I/O real, fique com ",e.jsx("code",{children:"Task<T>"})," — a complexidade extra não compensa."]}),e.jsx("h2",{children:"A regra de ouro: await uma única vez"}),e.jsxs("p",{children:["ValueTask vem com armadilhas. A principal: você só pode ",e.jsx("code",{children:"await"})," uma instância ",e.jsx("strong",{children:"uma vez"}),". Não pode armazenar em variável, esperar duas vezes, nem chamar ",e.jsx("code",{children:".Result"})," e ",e.jsx("code",{children:"await"}),' juntos. Isso porque, no modo "reutilizável", a estrutura interna é devolvida a um pool depois do primeiro consumo.']}),e.jsx("pre",{children:e.jsx("code",{children:`// ❌ ERRADO — comportamento indefinido
ValueTask<User> vt = GetUserAsync(42);
var a = await vt;
var b = await vt;   // pode lançar, retornar lixo ou explodir

// ✅ CERTO — converta para Task se precisar reutilizar
Task<User> t = GetUserAsync(42).AsTask();
var a = await t;
var b = await t;   // ok, Task pode ser awaited N vezes`})}),e.jsx("h2",{children:"Exemplo realista: cache de configuração"}),e.jsx("p",{children:"Um caso clássico é um leitor de configurações que mantém um cache em memória. Após o primeiro carregamento, todas as leituras são síncronas:"}),e.jsx("pre",{children:e.jsx("code",{children:`public sealed class ConfigCache
{
    private Dictionary<string, string>? _cached;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public ValueTask<string> GetAsync(string chave)
    {
        // Caminho rápido: cache populado, devolve direto
        if (_cached is not null && _cached.TryGetValue(chave, out var v))
            return new ValueTask<string>(v);

        // Caminho lento: precisa carregar
        return CarregarECacheAsync(chave);
    }

    private async ValueTask<string> CarregarECacheAsync(string chave)
    {
        await _lock.WaitAsync();
        try
        {
            _cached ??= await LerDoDiscoAsync();
            return _cached.TryGetValue(chave, out var v) ? v : "";
        }
        finally { _lock.Release(); }
    }

    private static Task<Dictionary<string, string>> LerDoDiscoAsync() =>
        Task.FromResult(new Dictionary<string, string> { ["debug"] = "true" });
}`})}),e.jsxs("p",{children:["O método público devolve ",e.jsx("code",{children:"ValueTask"})," sem ser ",e.jsx("code",{children:"async"})," no caminho feliz; só o método lento usa ",e.jsx("code",{children:"async ValueTask"}),". Em produção, 99,9% das chamadas alocam ",e.jsx("strong",{children:"zero"})," bytes."]}),e.jsxs(a,{type:"warning",title:"Não vire fanático",children:["Substituir todo ",e.jsx("code",{children:"Task"})," por ",e.jsx("code",{children:"ValueTask"})," é cargo cult. ValueTask é maior em bytes, copia mais, e perde otimizações que o runtime aplica em ",e.jsx("code",{children:"Task"}),". Use só onde mediu benefício real com benchmarks (BenchmarkDotNet)."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Aguardar duas vezes:"})," resultado imprevisível. Use ",e.jsx("code",{children:".AsTask()"})," antes."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Acessar ",e.jsx("code",{children:".Result"})," antes de completar:"]})," bloqueia ou lança. Sempre ",e.jsx("code",{children:"await"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Usar em APIs públicas sem necessidade:"})," obriga consumidores a lidarem com a complexidade. Prefira ",e.jsx("code",{children:"Task"})," em bibliotecas amplas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de medir:"})," sem benchmark, você está adivinhando se o ganho compensa."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"Task"})," é classe (heap); ",e.jsx("code",{children:"ValueTask"})," é struct (pilha) — evita alocação no caminho síncrono."]}),e.jsx("li",{children:"Use quando o método retorna síncrono na maioria das vezes e está em hot path."}),e.jsxs("li",{children:[e.jsx("strong",{children:"Await uma única vez"})," ou converta com ",e.jsx("code",{children:".AsTask()"}),"."]}),e.jsx("li",{children:"Não é substituto universal — meça antes de adotar."}),e.jsx("li",{children:"Cache hits, leituras de buffer e parsers em loop são casos clássicos."})]})]})}export{i as default};
