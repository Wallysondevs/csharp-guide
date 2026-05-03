import{j as e}from"./index-CzLAthD5.js";import{P as s,A as a}from"./AlertBox-CWJo3ar5.js";function n(){return e.jsxs(s,{title:"async/await: o que realmente acontece",subtitle:"Por trás dessas duas palavrinhas está uma das transformações mais elegantes do C# moderno.",difficulty:"intermediario",timeToRead:"14 min",children:[e.jsxs("p",{children:["Quando você liga para uma pizzaria, o atendente não fica olhando para a parede até o forno terminar — ele anota seu pedido, pendura na linha do fogão, e ",e.jsx("em",{children:"vai atender outro cliente"}),". Quando a pizza fica pronta, alguém o avisa. Esse é o coração de ",e.jsx("strong",{children:"async/await"}),": enquanto sua operação espera por algo lento (rede, disco, banco), a thread ",e.jsx("em",{children:"volta a fazer outra coisa"})," em vez de ficar parada. Quando o resultado chega, o código continua de onde parou. Em apps de servidor isso significa atender 10x mais usuários com o mesmo hardware. Em apps com UI, significa que a tela não congela."]}),e.jsx("h2",{children:"A palavra-chave async"}),e.jsxs("p",{children:["Marcar um método como ",e.jsx("code",{children:"async"}),' diz ao compilador: "',e.jsx("em",{children:"esse método vai usar await dentro dele, então traduza-o para uma máquina de estados"}),'". Sozinho, ',e.jsx("code",{children:"async"})," não faz nada paralelo — ele apenas habilita o uso de ",e.jsx("code",{children:"await"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`// 'async' marca o método; o tipo de retorno deve ser
// Task, Task<T> ou ValueTask<T> (raramente void)
public async Task<string> BaixarPaginaAsync(string url)
{
    using var http = new HttpClient();

    // 'await' faz a mágica: pausa este método sem bloquear thread
    string html = await http.GetStringAsync(url);

    return html.ToUpper();
}`})}),e.jsx("h2",{children:"O que await realmente faz"}),e.jsxs("p",{children:["Pense em ",e.jsx("code",{children:"await"}),' como um "ponto de salvamento". Quando o runtime encontra um ',e.jsx("code",{children:"await tarefa"}),":"]}),e.jsxs("ol",{children:[e.jsx("li",{children:"Verifica se a tarefa já terminou. Se sim, continua sincronamente (rápido, sem overhead)."}),e.jsxs("li",{children:["Se não, ",e.jsx("strong",{children:"devolve o controle"})," para quem chamou — a thread atual fica livre."]}),e.jsxs("li",{children:["Registra um ",e.jsx("em",{children:"callback"}),': "quando a tarefa terminar, retome este método daqui".']}),e.jsx("li",{children:"Quando a operação termina (rede respondeu, etc.), o runtime agenda a continuação."})]}),e.jsxs("p",{children:["O resultado é que sua função ",e.jsx("em",{children:"parece"})," síncrona linha a linha, mas na verdade pode pausar e retomar várias vezes. O compilador transforma o método numa ",e.jsx("strong",{children:"state machine"})," (máquina de estados) — uma struct gerada que guarda em qual ",e.jsx("code",{children:"await"})," você parou e quais variáveis locais existem."]}),e.jsxs(a,{type:"info",title:"Quem segura a thread?",children:["Durante a espera de uma chamada HTTP assíncrona, ",e.jsx("em",{children:"nenhuma thread"})," está bloqueada. O sistema operacional avisa o .NET por interrupção quando os bytes chegam. Isso é o que permite milhares de requisições simultâneas com poucas threads."]}),e.jsx("h2",{children:"Exemplo prático: HttpClient"}),e.jsx("p",{children:"O caso clássico — fazer uma chamada HTTP sem travar o app:"}),e.jsx("pre",{children:e.jsx("code",{children:`using System.Net.Http;
using System.Threading.Tasks;

class Programa
{
    static readonly HttpClient http = new();

    static async Task Main()
    {
        Console.WriteLine("Iniciando download...");

        Task<string> tarefa = http.GetStringAsync("https://example.com");

        Console.WriteLine("Já posso fazer outra coisa enquanto baixa.");

        // Só aqui esperamos o resultado
        string conteudo = await tarefa;

        Console.WriteLine($"Recebi {conteudo.Length} caracteres.");
    }
}`})}),e.jsxs("p",{children:["Note que ",e.jsx("code",{children:"Main"})," também é ",e.jsx("code",{children:"async"}),' — desde C# 7.1 isso é permitido, e o compilador gera o "wrapper" necessário. Sem ',e.jsx("code",{children:"await"}),", a Task ",e.jsx("code",{children:"tarefa"})," roda em segundo plano até que algo a aguarde."]}),e.jsx("h2",{children:"O contexto de sincronização"}),e.jsxs("p",{children:['Em apps com UI (WPF, WinForms, MAUI), só a "thread de UI" pode mexer em controles visuais. Quando você usa ',e.jsx("code",{children:"await"}),", por padrão o C# captura o ",e.jsx("strong",{children:"SynchronizationContext"})," atual e ",e.jsx("em",{children:"volta nele"})," após a espera — isso garante que ",e.jsx("code",{children:"label.Text = ..."})," depois do ",e.jsx("code",{children:"await"})," ainda funcione na thread certa."]}),e.jsx("pre",{children:e.jsx("code",{children:`private async void btnBuscar_Click(object sender, EventArgs e)
{
    btnBuscar.Enabled = false;
    string dados = await http.GetStringAsync("https://api.x.com");
    // Aqui voltamos AUTOMATICAMENTE para a thread de UI
    txtResultado.Text = dados;
    btnBuscar.Enabled = true;
}`})}),e.jsxs("p",{children:["Em ASP.NET clássico era similar (havia o ",e.jsx("code",{children:"AspNetSynchronizationContext"}),"). Em ASP.NET Core, ",e.jsx("strong",{children:"não existe"})," contexto — qualquer thread do pool pode continuar. Em código de biblioteca, ",e.jsx("code",{children:"ConfigureAwait(false)"})," evita capturar o contexto (assunto de outro capítulo)."]}),e.jsx("h2",{children:"NUNCA use .Result ou .Wait()"}),e.jsx("p",{children:"A pior armadilha de iniciantes em async:"}),e.jsx("pre",{children:e.jsx("code",{children:`// ERRADO — bloqueia a thread, anula todo benefício
string html = http.GetStringAsync(url).Result;
tarefa.Wait();

// PIOR — em apps com SynchronizationContext (UI/ASP.NET clássico)
// causa DEADLOCK: a continuação espera a UI thread, que está bloqueada
// esperando a tarefa, que precisa da UI thread...`})}),e.jsxs("p",{children:["Use ",e.jsx("code",{children:"await"}),". Sempre. Se você está em ",e.jsx("code",{children:"Main"})," ou em código que não pode ser ",e.jsx("code",{children:"async"})," (raro), use ",e.jsx("code",{children:"GetAwaiter().GetResult()"})," — que pelo menos não embrulha exceções em ",e.jsx("code",{children:"AggregateException"}),"."]}),e.jsxs(a,{type:"danger",title:"Deadlock silencioso",children:["Misturar código assíncrono com ",e.jsx("code",{children:".Result"})," em apps WPF, WinForms ou ASP.NET clássico é a causa #1 de telas congeladas. Se você precisa chamar código async, ",e.jsx("em",{children:"todo o caminho"}),' precisa ser async ("async all the way").']}),e.jsx("h2",{children:"Compondo várias operações"}),e.jsxs("p",{children:["Para esperar várias tarefas em paralelo, use ",e.jsx("code",{children:"Task.WhenAll"}),":"]}),e.jsx("pre",{children:e.jsx("code",{children:`var t1 = http.GetStringAsync("https://a.com");
var t2 = http.GetStringAsync("https://b.com");
var t3 = http.GetStringAsync("https://c.com");

string[] todos = await Task.WhenAll(t1, t2, t3);
// As três requisições rodam concorrentemente`})}),e.jsxs("p",{children:[e.jsx("code",{children:"Task.WhenAny"})," retorna assim que ",e.jsx("em",{children:"uma"}),' das tarefas termina — útil para timeouts ou "primeiro que responder vence".']}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"async void:"})," permitido só para handlers de evento. Em outros lugares, exceções não são capturáveis e processo morre."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer await:"})," ",e.jsx("code",{children:"SalvarAsync()"})," sem await retorna a Task imediatamente — a operação pode nem terminar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Sufixo Async esquecido:"})," convenção é nomear métodos assíncronos como ",e.jsx("code",{children:"FazerAlgoAsync"}),". Ajuda a leitura."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Pensar que async = thread nova:"})," não. Async é sobre ",e.jsx("em",{children:"não bloquear"}),". Threads novas só com ",e.jsx("code",{children:"Task.Run"}),"."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"async"})," habilita ",e.jsx("code",{children:"await"})," e transforma o método em uma state machine."]}),e.jsxs("li",{children:[e.jsx("code",{children:"await"})," pausa o método sem bloquear a thread; retoma quando a Task termina."]}),e.jsx("li",{children:"Em UI/ASP.NET clássico há captura de SynchronizationContext; em ASP.NET Core não."}),e.jsxs("li",{children:["Nunca use ",e.jsx("code",{children:".Result"})," ou ",e.jsx("code",{children:".Wait()"})," — caminhe assíncrono até o topo."]}),e.jsxs("li",{children:[e.jsx("code",{children:"Task.WhenAll"})," e ",e.jsx("code",{children:"Task.WhenAny"})," compõem operações concorrentes."]})]})]})}export{n as default};
