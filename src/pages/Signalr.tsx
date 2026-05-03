import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Signalr() {
  return (
    <PageContainer
      title="SignalR: comunicação em tempo real"
      subtitle="Push do servidor para o cliente sem polling — chats, notificações e dashboards ao vivo."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <p>
        HTTP tradicional é uma conversa de mão única: o cliente pergunta, o servidor responde, fim. Se você quer <em>push</em> — o servidor avisar o navegador "uma nova mensagem chegou" — precisa improvisar com polling (perguntar de tempos em tempos) ou abrir uma conexão persistente. <strong>SignalR</strong> é a biblioteca da Microsoft que faz essa segunda parte ficar trivial. Pense nela como um <em>walkie-talkie</em> entre servidor e clientes: a conexão fica aberta e qualquer um dos lados pode falar quando quiser.
      </p>

      <h2>Como SignalR escolhe o transporte</h2>
      <p>
        Por baixo dos panos, SignalR negocia automaticamente o melhor transporte disponível: <strong>WebSockets</strong> (full-duplex, ideal), <em>Server-Sent Events</em> ou <em>Long Polling</em> (fallback para redes restritivas). Você escreve o mesmo código C# e o framework decide. Isso é como um app de mensagens que tenta dados móveis primeiro, depois Wi-Fi, depois SMS — sem você se preocupar.
      </p>

      <h2>Configuração mínima</h2>
      <pre><code>{`// Program.cs
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

var app = builder.Build();
app.UseDefaultFiles();   // serve index.html
app.UseStaticFiles();
app.MapHub<ChatHub>("/chat"); // expõe o hub no caminho /chat
app.Run();`}</code></pre>

      <h2>O Hub: a "central telefônica"</h2>
      <p>
        Um <strong>Hub</strong> é uma classe servidora que define quais métodos os clientes podem chamar e quais métodos o servidor pode chamar de volta nos clientes. É a peça central; pense nela como a operadora de uma central telefônica antiga, conectando ligações.
      </p>
      <pre><code>{`public class ChatHub : Hub
{
    // Cliente chama: connection.invoke("Enviar", "Maria", "Olá!")
    public async Task Enviar(string usuario, string mensagem)
    {
        // Manda para TODOS os clientes conectados
        await Clients.All.SendAsync("RecebeuMensagem", usuario, mensagem);
    }

    // Manda só para quem está no grupo "sala-1"
    public async Task EnviarNaSala(string sala, string texto)
    {
        await Clients.Group(sala).SendAsync("RecebeuMensagem", Context.UserIdentifier, texto);
    }

    // Manda só para o próprio cliente que chamou
    public Task Ping() => Clients.Caller.SendAsync("Pong");

    // Lifecycle hooks
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Conectou: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? ex)
    {
        Console.WriteLine($"Desconectou: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(ex);
    }

    // Entrar/sair de um grupo (sala de chat)
    public Task EntrarSala(string sala) =>
        Groups.AddToGroupAsync(Context.ConnectionId, sala);
}`}</code></pre>
      <p>
        Note três alvos diferentes: <code>Clients.All</code> (broadcast geral), <code>Clients.Group("sala-1")</code> (apenas membros do grupo, ótimo para salas de chat e canais por usuário), e <code>Clients.Caller</code> (resposta direcionada apenas ao remetente). Há também <code>Clients.Others</code>, <code>Clients.User(userId)</code> e <code>Clients.Users(new[]&#123;"id1","id2"&#125;)</code>.
      </p>

      <AlertBox type="info" title="Hub sem estado">
        O Hub é instanciado <strong>a cada chamada</strong>. Não guarde estado em campos privados — eles se perdem na próxima invocação. Para estado compartilhado, use serviços via DI (singleton, banco, cache). Use <code>Context.ConnectionId</code> para identificar a conexão entre chamadas.
      </AlertBox>

      <h2>Cliente JavaScript</h2>
      <pre><code>{`<script src="https://cdn.jsdelivr.net/npm/@microsoft/signalr/dist/browser/signalr.min.js"></script>
<script>
const conn = new signalR.HubConnectionBuilder()
    .withUrl("/chat")
    .withAutomaticReconnect([0, 2000, 5000, 10000]) // tentativas em ms
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Servidor manda -> cliente reage
conn.on("RecebeuMensagem", (usuario, msg) => {
    const li = document.createElement("li");
    li.textContent = usuario + ": " + msg;
    document.getElementById("lista").appendChild(li);
});

// Conexão caiu e voltou
conn.onreconnected(id => console.log("Reconectado, novo id:", id));

await conn.start();
await conn.invoke("EntrarSala", "geral");
await conn.invoke("Enviar", "Ana", "Oi pessoal!");
</script>`}</code></pre>
      <p>
        Os nomes dos métodos no <code>invoke</code>/<code>on</code> precisam casar exatamente com o servidor (sem o prefixo do Hub). O <code>withAutomaticReconnect</code> faz tentativas escalonadas — útil para Wi-Fi instável. Se a conexão cair definitivamente (servidor reiniciado, por exemplo), você precisa reentrar nos grupos manualmente, porque o servidor perdeu esse mapeamento.
      </p>

      <h2>Chamando do servidor sem ser de dentro do Hub</h2>
      <p>
        Frequentemente quem precisa empurrar uma notificação é um <em>controller</em> ou um job em background. Para isso, peça <code>IHubContext&lt;ChatHub&gt;</code> via DI:
      </p>
      <pre><code>{`public class NotificacaoController : ControllerBase
{
    private readonly IHubContext<ChatHub> _hub;
    public NotificacaoController(IHubContext<ChatHub> hub) => _hub = hub;

    [HttpPost("avisar-todos")]
    public async Task<IActionResult> Avisar(string texto)
    {
        await _hub.Clients.All.SendAsync("RecebeuMensagem", "sistema", texto);
        return Ok();
    }
}`}</code></pre>

      <h2>Escalando horizontalmente: backplane Redis</h2>
      <p>
        Quando você tem <strong>uma única instância</strong> do servidor, tudo funciona — todas as conexões estão na mesma memória. Mas e quando você roda 3 réplicas atrás de um load balancer? Cliente A conectou na réplica 1, cliente B na réplica 2; se A manda mensagem para o grupo "geral", a réplica 2 não sabe que deveria entregá-la a B. A solução é o <strong>backplane</strong>: um pub/sub central que sincroniza todas as instâncias.
      </p>
      <pre><code>{`// dotnet add package Microsoft.AspNetCore.SignalR.StackExchangeRedis
builder.Services.AddSignalR().AddStackExchangeRedis(opts =>
{
    opts.Configuration.ChannelPrefix = RedisChannel.Literal("MyApp");
    opts.Configuration.EndPoints.Add("redis:6379");
});`}</code></pre>
      <p>
        Cada réplica publica suas mensagens no Redis e ouve as das outras. Para volumes muito altos, há também o <strong>Azure SignalR Service</strong>, gerenciado, que assume a parte de manter as conexões abertas e lida com milhões de clientes.
      </p>

      <AlertBox type="warning" title="WebSocket atrás de proxy">
        Se você usa Nginx, IIS ou Cloudflare na frente, é preciso habilitar explicitamente o protocolo WebSocket (<code>proxy_set_header Upgrade $http_upgrade</code> no Nginx). Sem isso, o transporte cai para Long Polling — funciona, mas com mais latência e mais carga no servidor.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Guardar estado em campos do Hub</strong> — perdido a cada chamada. Use serviços ou cache.</li>
        <li><strong>Esquecer de entrar nos grupos após reconexão</strong> — o servidor não memoriza isso.</li>
        <li><strong>Operações longas no método do Hub</strong> — a conexão fica bloqueada. Despache para um background service e responda depois com <code>SendAsync</code>.</li>
        <li><strong>Múltiplas réplicas sem backplane</strong> — mensagens chegam só para um pedaço dos usuários.</li>
        <li><strong>Não tratar <code>onclose</code> no cliente</strong> — UI mostra "conectado" enquanto o servidor caiu.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>SignalR negocia WebSocket/SSE/Long Polling automaticamente.</li>
        <li>Hub é a classe servidora; <code>Clients.All/Group/Caller</code> seleciona o destinatário.</li>
        <li>Hub não guarda estado entre chamadas — use DI.</li>
        <li>Cliente JS usa <code>HubConnectionBuilder</code> com <code>withAutomaticReconnect</code>.</li>
        <li>Para múltiplas instâncias, use backplane Redis ou Azure SignalR Service.</li>
      </ul>
    </PageContainer>
  );
}
