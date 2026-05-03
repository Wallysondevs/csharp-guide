import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AsyncAwaitFundamentos() {
  return (
    <PageContainer
      title="async/await: o que realmente acontece"
      subtitle="Por trás dessas duas palavrinhas está uma das transformações mais elegantes do C# moderno."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Quando você liga para uma pizzaria, o atendente não fica olhando para a parede até o forno terminar — ele anota seu pedido, pendura na linha do fogão, e <em>vai atender outro cliente</em>. Quando a pizza fica pronta, alguém o avisa. Esse é o coração de <strong>async/await</strong>: enquanto sua operação espera por algo lento (rede, disco, banco), a thread <em>volta a fazer outra coisa</em> em vez de ficar parada. Quando o resultado chega, o código continua de onde parou. Em apps de servidor isso significa atender 10x mais usuários com o mesmo hardware. Em apps com UI, significa que a tela não congela.
      </p>

      <h2>A palavra-chave async</h2>
      <p>
        Marcar um método como <code>async</code> diz ao compilador: "<em>esse método vai usar await dentro dele, então traduza-o para uma máquina de estados</em>". Sozinho, <code>async</code> não faz nada paralelo — ele apenas habilita o uso de <code>await</code>:
      </p>
      <pre><code>{`// 'async' marca o método; o tipo de retorno deve ser
// Task, Task<T> ou ValueTask<T> (raramente void)
public async Task<string> BaixarPaginaAsync(string url)
{
    using var http = new HttpClient();

    // 'await' faz a mágica: pausa este método sem bloquear thread
    string html = await http.GetStringAsync(url);

    return html.ToUpper();
}`}</code></pre>

      <h2>O que await realmente faz</h2>
      <p>
        Pense em <code>await</code> como um "ponto de salvamento". Quando o runtime encontra um <code>await tarefa</code>:
      </p>
      <ol>
        <li>Verifica se a tarefa já terminou. Se sim, continua sincronamente (rápido, sem overhead).</li>
        <li>Se não, <strong>devolve o controle</strong> para quem chamou — a thread atual fica livre.</li>
        <li>Registra um <em>callback</em>: "quando a tarefa terminar, retome este método daqui".</li>
        <li>Quando a operação termina (rede respondeu, etc.), o runtime agenda a continuação.</li>
      </ol>
      <p>
        O resultado é que sua função <em>parece</em> síncrona linha a linha, mas na verdade pode pausar e retomar várias vezes. O compilador transforma o método numa <strong>state machine</strong> (máquina de estados) — uma struct gerada que guarda em qual <code>await</code> você parou e quais variáveis locais existem.
      </p>

      <AlertBox type="info" title="Quem segura a thread?">
        Durante a espera de uma chamada HTTP assíncrona, <em>nenhuma thread</em> está bloqueada. O sistema operacional avisa o .NET por interrupção quando os bytes chegam. Isso é o que permite milhares de requisições simultâneas com poucas threads.
      </AlertBox>

      <h2>Exemplo prático: HttpClient</h2>
      <p>
        O caso clássico — fazer uma chamada HTTP sem travar o app:
      </p>
      <pre><code>{`using System.Net.Http;
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
}`}</code></pre>
      <p>
        Note que <code>Main</code> também é <code>async</code> — desde C# 7.1 isso é permitido, e o compilador gera o "wrapper" necessário. Sem <code>await</code>, a Task <code>tarefa</code> roda em segundo plano até que algo a aguarde.
      </p>

      <h2>O contexto de sincronização</h2>
      <p>
        Em apps com UI (WPF, WinForms, MAUI), só a "thread de UI" pode mexer em controles visuais. Quando você usa <code>await</code>, por padrão o C# captura o <strong>SynchronizationContext</strong> atual e <em>volta nele</em> após a espera — isso garante que <code>label.Text = ...</code> depois do <code>await</code> ainda funcione na thread certa.
      </p>
      <pre><code>{`private async void btnBuscar_Click(object sender, EventArgs e)
{
    btnBuscar.Enabled = false;
    string dados = await http.GetStringAsync("https://api.x.com");
    // Aqui voltamos AUTOMATICAMENTE para a thread de UI
    txtResultado.Text = dados;
    btnBuscar.Enabled = true;
}`}</code></pre>
      <p>
        Em ASP.NET clássico era similar (havia o <code>AspNetSynchronizationContext</code>). Em ASP.NET Core, <strong>não existe</strong> contexto — qualquer thread do pool pode continuar. Em código de biblioteca, <code>ConfigureAwait(false)</code> evita capturar o contexto (assunto de outro capítulo).
      </p>

      <h2>NUNCA use .Result ou .Wait()</h2>
      <p>
        A pior armadilha de iniciantes em async:
      </p>
      <pre><code>{`// ERRADO — bloqueia a thread, anula todo benefício
string html = http.GetStringAsync(url).Result;
tarefa.Wait();

// PIOR — em apps com SynchronizationContext (UI/ASP.NET clássico)
// causa DEADLOCK: a continuação espera a UI thread, que está bloqueada
// esperando a tarefa, que precisa da UI thread...`}</code></pre>
      <p>
        Use <code>await</code>. Sempre. Se você está em <code>Main</code> ou em código que não pode ser <code>async</code> (raro), use <code>GetAwaiter().GetResult()</code> — que pelo menos não embrulha exceções em <code>AggregateException</code>.
      </p>

      <AlertBox type="danger" title="Deadlock silencioso">
        Misturar código assíncrono com <code>.Result</code> em apps WPF, WinForms ou ASP.NET clássico é a causa #1 de telas congeladas. Se você precisa chamar código async, <em>todo o caminho</em> precisa ser async ("async all the way").
      </AlertBox>

      <h2>Compondo várias operações</h2>
      <p>
        Para esperar várias tarefas em paralelo, use <code>Task.WhenAll</code>:
      </p>
      <pre><code>{`var t1 = http.GetStringAsync("https://a.com");
var t2 = http.GetStringAsync("https://b.com");
var t3 = http.GetStringAsync("https://c.com");

string[] todos = await Task.WhenAll(t1, t2, t3);
// As três requisições rodam concorrentemente`}</code></pre>
      <p>
        <code>Task.WhenAny</code> retorna assim que <em>uma</em> das tarefas termina — útil para timeouts ou "primeiro que responder vence".
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>async void:</strong> permitido só para handlers de evento. Em outros lugares, exceções não são capturáveis e processo morre.</li>
        <li><strong>Esquecer await:</strong> <code>SalvarAsync()</code> sem await retorna a Task imediatamente — a operação pode nem terminar.</li>
        <li><strong>Sufixo Async esquecido:</strong> convenção é nomear métodos assíncronos como <code>FazerAlgoAsync</code>. Ajuda a leitura.</li>
        <li><strong>Pensar que async = thread nova:</strong> não. Async é sobre <em>não bloquear</em>. Threads novas só com <code>Task.Run</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>async</code> habilita <code>await</code> e transforma o método em uma state machine.</li>
        <li><code>await</code> pausa o método sem bloquear a thread; retoma quando a Task termina.</li>
        <li>Em UI/ASP.NET clássico há captura de SynchronizationContext; em ASP.NET Core não.</li>
        <li>Nunca use <code>.Result</code> ou <code>.Wait()</code> — caminhe assíncrono até o topo.</li>
        <li><code>Task.WhenAll</code> e <code>Task.WhenAny</code> compõem operações concorrentes.</li>
      </ul>
    </PageContainer>
  );
}
