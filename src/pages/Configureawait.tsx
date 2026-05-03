import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Configureawait() {
  return (
    <PageContainer
      title="ConfigureAwait(false): quando e por quê"
      subtitle="Entendendo o contexto de sincronização e como evitá-lo em código de biblioteca."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <p>
        Já dissemos que <code>await</code> "pausa o método e retoma quando a Task termina". Mas <em>onde</em> ele retoma? Em qual thread? A resposta depende de algo chamado <strong>SynchronizationContext</strong> — um objeto que diz "quando uma operação assíncrona terminar, agende a continuação aqui". Em apps de UI (WPF, WinForms, MAUI) e em ASP.NET <em>clássico</em>, esse contexto existe. Em ASP.NET Core e console apps, não. <code>ConfigureAwait(false)</code> é a forma de dizer ao runtime: "não me importo com o contexto, retome em qualquer thread livre". Entender isso evita travamentos misteriosos e melhora performance.
      </p>

      <h2>O que é o SynchronizationContext</h2>
      <p>
        Imagine que sua interface gráfica é um restaurante onde só <em>um</em> garçom pode entregar pedidos na cozinha (a thread de UI). Quando você chama <code>await DownloadAsync()</code> de dentro de um botão, a operação roda fora dessa thread. Quando termina, o C# precisa decidir: a continuação deve voltar à thread de UI? Em apps de desktop, <strong>sim</strong>, porque a próxima linha pode mexer em controles visuais. Esse retorno automático é o trabalho do SynchronizationContext.
      </p>
      <pre><code>{`// Em WinForms — captura o contexto de UI
private async void btn_Click(object sender, EventArgs e)
{
    var dados = await http.GetStringAsync(url);
    // Aqui voltamos à UI thread automaticamente
    txtBox.Text = dados; // funciona!
}`}</code></pre>
      <p>
        Esse "voltar automaticamente" é conveniente, mas tem custo: a continuação fica enfileirada na UI thread, mesmo se você não precisa mexer em nada visual. E pior — pode causar <strong>deadlock</strong>.
      </p>

      <h2>O deadlock clássico</h2>
      <p>
        Suponha que você esteja em um app WPF e, num lugar mal escrito, alguém usa <code>.Result</code>:
      </p>
      <pre><code>{`// Código de biblioteca:
public async Task<string> CarregarAsync()
{
    return await http.GetStringAsync(url); // captura UI context
}

// Código de UI (ERRADO):
private void btn_Click(object sender, EventArgs e)
{
    string r = CarregarAsync().Result; // bloqueia a UI thread
}`}</code></pre>
      <p>
        Sequência: a UI thread chama <code>CarregarAsync</code> e fica bloqueada esperando <code>.Result</code>. A Task interna terminou, mas precisa voltar à UI thread para executar a continuação — que está bloqueada esperando ela. <strong>Deadlock perfeito.</strong>
      </p>

      <h2>ConfigureAwait(false) ao resgate</h2>
      <p>
        Se a biblioteca disser "não preciso voltar ao contexto", a continuação roda em qualquer thread do pool, e o deadlock somesomente da equação:
      </p>
      <pre><code>{`public async Task<string> CarregarAsync()
{
    // .ConfigureAwait(false) = não capture o SynchronizationContext
    return await http.GetStringAsync(url).ConfigureAwait(false);
}`}</code></pre>
      <p>
        Agora a continuação roda numa thread do ThreadPool, devolve o resultado, e o <code>.Result</code> destrava. (Você ainda não deveria usar <code>.Result</code>, mas pelo menos a biblioteca é robusta.)
      </p>

      <AlertBox type="info" title="Regra de ouro de bibliotecas">
        Em <strong>todo</strong> código de biblioteca (NuGet, projetos compartilhados, código de domínio), use <code>.ConfigureAwait(false)</code> em <em>todos</em> os <code>await</code>. Você não controla quem vai chamar — pode ser uma app WPF que congela.
      </AlertBox>

      <h2>Em código de aplicação UI</h2>
      <p>
        Em <em>handlers</em> de UI, o oposto: você normalmente <strong>quer</strong> voltar à UI thread, então <em>não</em> use <code>ConfigureAwait(false)</code>. O comportamento padrão (<code>true</code>) está correto:
      </p>
      <pre><code>{`private async void btn_Click(object sender, EventArgs e)
{
    btn.Enabled = false;

    // Sem ConfigureAwait — voltamos à UI thread
    var dados = await ServicoApi.CarregarAsync();

    txtCaixa.Text = dados;     // mexe em controle: precisa de UI thread
    btn.Enabled = true;
}`}</code></pre>

      <h2>ASP.NET Core: pode ignorar</h2>
      <p>
        Eis a parte feliz: <strong>ASP.NET Core não tem SynchronizationContext</strong>. A continuação sempre roda em qualquer thread disponível. Em código de controller/handler ASP.NET Core, <code>ConfigureAwait(false)</code> não muda comportamento — só polui a leitura. A maioria dos projetos modernos omite, ou usa um analyzer (<code>ConfigureAwait.Fody</code> ou <code>.editorconfig</code>) para padronizar.
      </p>
      <pre><code>{`// ASP.NET Core controller — não precisa de ConfigureAwait
public async Task<IActionResult> ObterAsync(int id)
{
    var item = await _repo.BuscarPorIdAsync(id);
    return Ok(item);
}`}</code></pre>

      <h2>ASP.NET clássico (Framework): cuidado</h2>
      <p>
        Em ASP.NET pré-Core (System.Web), existia o <code>AspNetSynchronizationContext</code> — similar ao de UI. Bibliotecas que rodam tanto em .NET Framework quanto Core precisam usar <code>ConfigureAwait(false)</code> por compatibilidade.
      </p>

      <AlertBox type="warning" title="Analyzer ajuda">
        Habilite o analyzer da Microsoft <code>CA2007</code> (<em>Do not directly await a Task without ConfigureAwait</em>) em projetos de biblioteca. Ele acende um aviso em cada <code>await</code> sem ConfigureAwait. Em projetos de aplicação, desligue.
      </AlertBox>

      <h2>ConfigureAwaitOptions (.NET 8)</h2>
      <p>
        A partir do .NET 8 surgiu uma sobrecarga com <code>ConfigureAwaitOptions</code>, oferecendo controle adicional:
      </p>
      <pre><code>{`await tarefa.ConfigureAwait(ConfigureAwaitOptions.None);
await tarefa.ConfigureAwait(ConfigureAwaitOptions.ContinueOnCapturedContext);
await tarefa.ConfigureAwait(ConfigureAwaitOptions.SuppressThrowing); // engole exceções
await tarefa.ConfigureAwait(ConfigureAwaitOptions.ForceYielding);`}</code></pre>
      <p>
        Use com parcimônia — especialmente <code>SuppressThrowing</code>, que é poderoso e perigoso (engole erros silenciosamente).
      </p>

      <h2>E aplicações Console?</h2>
      <p>
        Console apps não têm SynchronizationContext padrão. <code>ConfigureAwait(false)</code> não muda nada. Você pode usar ou não — é estilo. Para consistência com bibliotecas, muitas equipes adotam <code>false</code> em todo lugar.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>ConfigureAwait(false)</code> em biblioteca:</strong> sua DLL parece funcionar nos testes (console), mas trava a UI de quem usar.</li>
        <li><strong>Usar <code>ConfigureAwait(false)</code> num handler de UI e depois mexer em controle:</strong> exceção "thread inválida" — a continuação caiu no ThreadPool.</li>
        <li><strong>Misturar com <code>.Result</code>:</strong> pode resolver o deadlock do dia, mas a real solução é "async all the way" e remover o <code>.Result</code>.</li>
        <li><strong>Achar que <code>ConfigureAwait(false)</code> melhora performance em ASP.NET Core:</strong> não. Lá, é placebo.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>SynchronizationContext decide em qual thread a continuação após <code>await</code> roda.</li>
        <li>UI e ASP.NET clássico têm contexto; ASP.NET Core e console, não.</li>
        <li><code>ConfigureAwait(false)</code> diz "qualquer thread serve" — evita deadlocks e custo extra.</li>
        <li>Use <code>false</code> em <strong>todo código de biblioteca</strong>; em handlers de UI, deixe o padrão (<code>true</code>).</li>
        <li>.NET 8 trouxe <code>ConfigureAwaitOptions</code> para casos avançados.</li>
      </ul>
    </PageContainer>
  );
}
