import{j as e}from"./index-CzLAthD5.js";import{P as a,A as o}from"./AlertBox-CWJo3ar5.js";function c(){return e.jsxs(a,{title:"CancellationToken: cancelando operações async",subtitle:"O padrão cooperativo do .NET para interromper trabalho longo de forma limpa.",difficulty:"intermediario",timeToRead:"12 min",children:[e.jsxs("p",{children:['Imagine que você abriu um vídeo gigante para baixar e mudou de ideia — clicou em "cancelar". Em código, parar uma operação em andamento ',e.jsx("em",{children:"de forma segura"}),' é mais difícil do que parece: você não pode simplesmente "matar" uma thread (isso deixa recursos pendurados, conexões abertas, arquivos meio escritos). A solução do .NET é o padrão ',e.jsx("strong",{children:"cooperativo"}),": o código que está trabalhando verifica, de tempos em tempos, se foi pedido para parar — através de um objeto chamado ",e.jsx("strong",{children:"CancellationToken"}),'. Quando vê o pedido, ele encerra graciosamente. Pense no token como uma plaquinha de "PARE" que alguém de fora pode levantar; o trabalhador olha para ela periodicamente.']}),e.jsx("h2",{children:"Os dois personagens: Source e Token"}),e.jsx("p",{children:"O modelo tem duas peças:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"CancellationTokenSource"}),": quem ",e.jsx("em",{children:"solicita"})," o cancelamento. Tem o método ",e.jsx("code",{children:"Cancel()"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"CancellationToken"}),": quem é ",e.jsx("em",{children:"verificado"})," pelo trabalho. É passado como argumento."]})]}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Threading;
using System.Threading.Tasks;

var cts = new CancellationTokenSource();
CancellationToken token = cts.Token;

Task tarefa = TrabalharAsync(token);

// Em algum lugar (botão, timeout, etc.)
cts.Cancel(); // levanta a plaquinha PARE

try { await tarefa; }
catch (OperationCanceledException) { Console.WriteLine("Cancelado!"); }`})}),e.jsx("h2",{children:"Passando o token a métodos do .NET"}),e.jsxs("p",{children:["Quase todo método assíncrono moderno aceita um ",e.jsx("code",{children:"CancellationToken"})," como último parâmetro. Repassá-lo é o caminho mais simples — eles já fazem todo o trabalho de checagem e lançam ",e.jsx("code",{children:"OperationCanceledException"})," quando preciso:"]}),e.jsx("pre",{children:e.jsx("code",{children:`async Task BaixarArquivoAsync(string url, string destino, CancellationToken ct)
{
    using var http = new HttpClient();

    // O token cancela a request HTTP no meio da rede se necessário
    using var resp = await http.GetAsync(url,
        HttpCompletionOption.ResponseHeadersRead, ct);

    using var arq = File.Create(destino);
    await resp.Content.CopyToAsync(arq, ct);
}`})}),e.jsx("p",{children:"Sem cancelamento, um download de 2 GB rodaria até o fim mesmo se o usuário desistisse. Com o token propagado, ele para no próximo bloco de bytes lido."}),e.jsx("h2",{children:"Em loops: ThrowIfCancellationRequested"}),e.jsx("p",{children:"Se você tem um loop CPU-bound (sem chamadas I/O assíncronas), precisa checar o token manualmente. Há duas formas:"}),e.jsx("pre",{children:e.jsx("code",{children:`void Processar(IEnumerable<Item> itens, CancellationToken ct)
{
    foreach (var item in itens)
    {
        // Forma 1: lança OperationCanceledException se foi pedido cancelar
        ct.ThrowIfCancellationRequested();

        // Forma 2: checagem manual (raro — prefira a forma 1)
        if (ct.IsCancellationRequested) return;

        ProcessarItem(item);
    }
}`})}),e.jsxs("p",{children:["A forma com exceção é preferida porque propaga naturalmente para cima e é capturada por ",e.jsx("code",{children:"try/catch (OperationCanceledException)"})," no chamador."]}),e.jsxs(o,{type:"info",title:"Por que cooperativo?",children:["Antigamente havia ",e.jsx("code",{children:"Thread.Abort()"}),", que matava a thread brutalmente. Resultado? Recursos vazavam, locks ficavam pendurados, processos corrompiam. O cancelamento cooperativo é mais trabalhoso, mas ",e.jsx("strong",{children:"seguro"}),": o código sempre tem chance de limpar antes de sair."]}),e.jsx("h2",{children:"Cancelar após timeout"}),e.jsxs("p",{children:[e.jsx("code",{children:"CancellationTokenSource"})," tem construtor que dispara o cancelamento sozinho após X tempo:"]}),e.jsx("pre",{children:e.jsx("code",{children:`// Cancela automaticamente após 5 segundos
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));

try
{
    var resp = await http.GetStringAsync("https://lento.com", cts.Token);
}
catch (OperationCanceledException) when (cts.IsCancellationRequested)
{
    Console.WriteLine("Servidor demorou demais!");
}`})}),e.jsxs("p",{children:["Esse padrão é a forma idiomática de timeout em código async no .NET — bem melhor que o velho ",e.jsx("code",{children:"Task.WhenAny"})," com Task.Delay."]}),e.jsx("h2",{children:"Combinando múltiplos tokens"}),e.jsxs("p",{children:["Às vezes você tem vários motivos para cancelar (timeout + botão do usuário + shutdown da app). Combine-os com ",e.jsx("code",{children:"CreateLinkedTokenSource"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`async Task ProcessarAsync(CancellationToken externalCt)
{
    using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(30));

    // Cancela se QUALQUER um for cancelado
    using var combinado = CancellationTokenSource.CreateLinkedTokenSource(
        externalCt, timeout.Token);

    await TarefaPesadaAsync(combinado.Token);
}`})}),e.jsx("h2",{children:"Register: callback ao cancelar"}),e.jsxs("p",{children:["Para reagir ao cancelamento de forma customizada (ex.: cancelar uma requisição em uma biblioteca antiga), use ",e.jsx("code",{children:"token.Register"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var cts = new CancellationTokenSource();
var conn = new SqlConnection(/*...*/);

// Quando cancelarem, fecha a conexão
using var registro = cts.Token.Register(() => conn.Close());`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"Register"})," retorna um ",e.jsx("code",{children:"IDisposable"}),"; descartar libera o callback caso você não precise mais."]}),e.jsx("h2",{children:"Em ASP.NET Core: HttpContext.RequestAborted"}),e.jsxs("p",{children:["Frameworks já fornecem tokens prontos. ASP.NET Core dá ",e.jsx("code",{children:"HttpContext.RequestAborted"}),", que cancela quando o cliente fecha a conexão:"]}),e.jsx("pre",{children:e.jsx("code",{children:`[HttpGet("relatorio")]
public async Task<IActionResult> GerarAsync(CancellationToken ct)
{
    // 'ct' já vem ligado ao RequestAborted automaticamente
    var dados = await _servico.GerarRelatorioAsync(ct);
    return Ok(dados);
}`})}),e.jsx("p",{children:"Se o usuário fecha a aba do navegador, o token cancela imediatamente — você economiza CPU/banco de dados."}),e.jsx(o,{type:"warning",title:"OperationCanceledException ≠ erro",children:"Não logue como erro grave. Cancelamento é fluxo normal — geralmente o usuário pediu, ou um timeout configurado por você disparou. Trate em catch separado."}),e.jsx("h2",{children:"CancellationToken.None: quando não cancelar"}),e.jsxs("p",{children:["Se o método exige um token mas você realmente não quer cancelar (em testes, scripts simples), passe ",e.jsx("code",{children:"CancellationToken.None"}),". Ele é uma estrutura imutável que nunca cancela:"]}),e.jsx("pre",{children:e.jsx("code",{children:"var dados = await BuscarAsync(CancellationToken.None);"})}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de propagar o token:"})," seu método aceita ",e.jsx("code",{children:"CancellationToken"})," mas não passa adiante para as chamadas internas — cancelar não tem efeito."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Não dispor o CancellationTokenSource:"})," ele tem recursos internos (especialmente com timeout). Use ",e.jsx("code",{children:"using var cts = ..."}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Capturar OperationCanceledException como Exception genérica:"})," dificulta distinguir cancelamento de erro real. Capture-a separadamente."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Loops longos sem checagem:"})," se um for de 10 milhões de iterações não chama ",e.jsx("code",{children:"ThrowIfCancellationRequested"}),", o token é inútil até o loop terminar."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:["Cancelamento é ",e.jsx("em",{children:"cooperativo"}),": o código verifica o token periodicamente."]}),e.jsxs("li",{children:[e.jsx("code",{children:"CancellationTokenSource"})," dispara, ",e.jsx("code",{children:"CancellationToken"})," é consultado."]}),e.jsxs("li",{children:["Métodos do .NET aceitam ",e.jsx("code",{children:"CancellationToken"})," como último parâmetro — propague."]}),e.jsxs("li",{children:[e.jsx("code",{children:"ThrowIfCancellationRequested"})," dentro de loops CPU-bound."]}),e.jsxs("li",{children:["Timeout: ",e.jsx("code",{children:"new CancellationTokenSource(TimeSpan.FromSeconds(N))"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:"CreateLinkedTokenSource"})," combina vários tokens."]})]})]})}export{c as default};
