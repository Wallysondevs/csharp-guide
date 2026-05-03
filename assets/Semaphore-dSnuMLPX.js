import{j as e}from"./index-CzLAthD5.js";import{P as a,A as s}from"./AlertBox-CWJo3ar5.js";function o(){return e.jsxs(a,{title:"SemaphoreSlim: controlando concorrência async",subtitle:"Quando você quer que no máximo N tarefas rodem ao mesmo tempo — nem mais, nem menos.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:["Imagine uma pizzaria com cinco fornos. Não importa quantos pedidos cheguem à cozinha: só cinco pizzas podem assar simultaneamente. Quando uma sai, a próxima da fila entra. Em programação, esse mecanismo se chama ",e.jsx("strong",{children:"semáforo"}),", e o C# oferece o ",e.jsx("code",{children:"SemaphoreSlim"})," — uma versão leve, otimizada para uso dentro de um único processo e, mais importante, ",e.jsxs("strong",{children:["compatível com ",e.jsx("code",{children:"async"}),"/",e.jsx("code",{children:"await"})]}),"."]}),e.jsx("h2",{children:"O problema: chamadas concorrentes demais"}),e.jsxs("p",{children:["Suponha que você precisa baixar 1000 URLs. Disparar todas com ",e.jsx("code",{children:"Task.WhenAll"})," de uma vez é desastroso: o sistema operacional rejeita conexões, a API remota te bloqueia por flood, a rede congestiona. Você quer um meio-termo: rodar, digamos, no máximo ",e.jsx("strong",{children:"5 downloads em paralelo"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`// ❌ Dispara mil requisições simultâneas — provavelmente quebra
var tarefas = urls.Select(u => httpClient.GetStringAsync(u));
var resultados = await Task.WhenAll(tarefas);`})}),e.jsx("h2",{children:"SemaphoreSlim: a fila controlada"}),e.jsxs("p",{children:['Você cria um semáforo dizendo quantas "vagas" existem. Cada tarefa, antes de fazer o trabalho, chama ',e.jsx("code",{children:"WaitAsync()"})," — se houver vaga, passa direto; se não, fica esperando assincronamente (sem bloquear thread). Ao terminar, chama ",e.jsx("code",{children:"Release()"})," para devolver a vaga."]}),e.jsx("pre",{children:e.jsx("code",{children:`// 5 vagas iniciais, máximo de 5 totais
var semaforo = new SemaphoreSlim(initialCount: 5, maxCount: 5);

async Task BaixarAsync(string url, HttpClient http)
{
    await semaforo.WaitAsync();    // pega vaga (ou espera)
    try
    {
        var html = await http.GetStringAsync(url);
        Console.WriteLine($"{url}: {html.Length} bytes");
    }
    finally
    {
        semaforo.Release();        // devolve vaga SEMPRE
    }
}

var http = new HttpClient();
var tarefas = urls.Select(u => BaixarAsync(u, http));
await Task.WhenAll(tarefas);`})}),e.jsxs("p",{children:["Repare em duas coisas críticas: o ",e.jsx("code",{children:"Release()"})," está dentro de ",e.jsx("code",{children:"finally"}),", garantindo que a vaga é liberada mesmo se a requisição lançar exceção, e usamos ",e.jsx("code",{children:"WaitAsync"})," (não ",e.jsx("code",{children:"Wait"}),") para não bloquear a thread enquanto espera."]}),e.jsxs(s,{type:"danger",title:"Esquecer o Release = deadlock",children:["Se você usar ",e.jsx("code",{children:"WaitAsync()"})," e o código quebrar antes do ",e.jsx("code",{children:"Release()"}),", a vaga nunca é devolvida. Em pouco tempo, o pool esgota e ",e.jsx("strong",{children:"todas as tarefas seguintes ficam presas para sempre"}),". O ",e.jsx("code",{children:"finally"})," não é opcional."]}),e.jsxs("h2",{children:["Sintaxe alternativa: ",e.jsx("code",{children:"using"})," com helper"]}),e.jsxs("p",{children:["Para reduzir o boilerplate, é comum criar uma extensão que devolve um ",e.jsx("code",{children:"IDisposable"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`public static class SemaphoreExtensions
{
    public static async Task<IDisposable> EnterAsync(this SemaphoreSlim s)
    {
        await s.WaitAsync();
        return new Releaser(s);
    }
    private sealed class Releaser(SemaphoreSlim s) : IDisposable
    {
        public void Dispose() => s.Release();
    }
}

// uso:
using (await semaforo.EnterAsync())
{
    var html = await http.GetStringAsync(url);
}`})}),e.jsx("h2",{children:"lock vs SemaphoreSlim vs Mutex"}),e.jsx("p",{children:"Três ferramentas parecidas, com propósitos distintos:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Ferramenta"}),e.jsx("th",{children:"Concorrência"}),e.jsx("th",{children:"Async?"}),e.jsx("th",{children:"Entre processos?"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"lock"})}),e.jsx("td",{children:"1"}),e.jsx("td",{children:"Não"}),e.jsx("td",{children:"Não"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"SemaphoreSlim"})}),e.jsx("td",{children:"N (configurável)"}),e.jsx("td",{children:"Sim"}),e.jsx("td",{children:"Não"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Mutex"})}),e.jsx("td",{children:"1"}),e.jsx("td",{children:"Não"}),e.jsx("td",{children:"Sim (com nome)"})]})]})]}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"lock"})," para proteger uma seção curta e síncrona. Use ",e.jsx("code",{children:"SemaphoreSlim(1, 1)"})," quando precisa do mesmo efeito mas em código ",e.jsx("code",{children:"async"}),". Use ",e.jsx("code",{children:"SemaphoreSlim(N)"})," para limitar concorrência. ",e.jsx("code",{children:"Mutex"})," só faz sentido se você precisa coordenar instâncias diferentes do ",e.jsx("em",{children:"mesmo"})," programa rodando ao mesmo tempo (raro)."]}),e.jsx("h2",{children:"Caso de produção: throttling de uma API externa"}),e.jsxs("p",{children:["A API do GitHub permite 30 requisições por minuto sem autenticação. Combinando ",e.jsx("code",{children:"SemaphoreSlim"})," com ",e.jsx("code",{children:"Task.Delay"}),", conseguimos respeitar o limite:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public sealed class GitHubClient(HttpClient http)
{
    private readonly SemaphoreSlim _slot = new(initialCount: 30, maxCount: 30);

    public async Task<string> GetUserAsync(string login)
    {
        await _slot.WaitAsync();
        // libera a vaga só depois de 60s — janela rolante
        _ = Task.Delay(TimeSpan.FromSeconds(60))
                .ContinueWith(_ => _slot.Release());

        return await http.GetStringAsync($"https://api.github.com/users/{login}");
    }
}`})}),e.jsxs("p",{children:["Aqui o ",e.jsx("code",{children:"Release"}),' não é imediato: ele acontece 60 segundos depois, simulando uma janela móvel. Se 30 chamadas dispararem em rajada, a 31ª espera até a primeira "vencer".']}),e.jsxs(s,{type:"info",title:"SemaphoreSlim aceita CancellationToken",children:[e.jsx("code",{children:"WaitAsync(CancellationToken)"})," permite desistir da espera. Útil para timeouts: ",e.jsx("code",{children:"await s.WaitAsync(cts.Token)"})," lança ",e.jsx("code",{children:"OperationCanceledException"})," se o token disparar antes de você conseguir vaga."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Release sem Wait:"})," aumenta o contador além do limite, quebrando o limite máximo."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Wait sem Release no finally:"})," deadlock silencioso ao primeiro erro."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Usar ",e.jsx("code",{children:"Wait()"})," em código async:"]})," bloqueia a thread, desperdiçando o ganho do async."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Compartilhar o mesmo semáforo entre operações independentes:"})," cria contenção desnecessária."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer de fazer ",e.jsx("code",{children:"Dispose()"}),":"]})," ",e.jsx("code",{children:"SemaphoreSlim"})," é ",e.jsx("code",{children:"IDisposable"}),", libere quando não precisar mais."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"SemaphoreSlim(N)"})," permite no máximo N tarefas simultâneas."]}),e.jsxs("li",{children:["Use ",e.jsx("code",{children:"WaitAsync()"})," para não bloquear thread em código assíncrono."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Release()"})," sempre dentro de ",e.jsx("code",{children:"finally"}),"."]}),e.jsxs("li",{children:["Para travas exclusivas em async, use ",e.jsx("code",{children:"SemaphoreSlim(1, 1)"})," em vez de ",e.jsx("code",{children:"lock"}),"."]}),e.jsxs("li",{children:["Aceita ",e.jsx("code",{children:"CancellationToken"})," para timeouts elegantes."]}),e.jsxs("li",{children:["Não confunda com ",e.jsx("code",{children:"Mutex"})," (entre processos) ou ",e.jsx("code",{children:"lock"})," (síncrono)."]})]})]})}export{o as default};
