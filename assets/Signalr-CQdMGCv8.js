import{j as e}from"./index-CzLAthD5.js";import{P as n,A as a}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(n,{title:"SignalR: comunicação em tempo real",subtitle:"Push do servidor para o cliente sem polling — chats, notificações e dashboards ao vivo.",difficulty:"intermediario",timeToRead:"16 min",children:[e.jsxs("p",{children:["HTTP tradicional é uma conversa de mão única: o cliente pergunta, o servidor responde, fim. Se você quer ",e.jsx("em",{children:"push"}),' — o servidor avisar o navegador "uma nova mensagem chegou" — precisa improvisar com polling (perguntar de tempos em tempos) ou abrir uma conexão persistente. ',e.jsx("strong",{children:"SignalR"})," é a biblioteca da Microsoft que faz essa segunda parte ficar trivial. Pense nela como um ",e.jsx("em",{children:"walkie-talkie"})," entre servidor e clientes: a conexão fica aberta e qualquer um dos lados pode falar quando quiser."]}),e.jsx("h2",{children:"Como SignalR escolhe o transporte"}),e.jsxs("p",{children:["Por baixo dos panos, SignalR negocia automaticamente o melhor transporte disponível: ",e.jsx("strong",{children:"WebSockets"})," (full-duplex, ideal), ",e.jsx("em",{children:"Server-Sent Events"})," ou ",e.jsx("em",{children:"Long Polling"})," (fallback para redes restritivas). Você escreve o mesmo código C# e o framework decide. Isso é como um app de mensagens que tenta dados móveis primeiro, depois Wi-Fi, depois SMS — sem você se preocupar."]}),e.jsx("h2",{children:"Configuração mínima"}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();

var app = builder.Build();
app.UseDefaultFiles();   // serve index.html
app.UseStaticFiles();
app.MapHub<ChatHub>("/chat"); // expõe o hub no caminho /chat
app.Run();`})}),e.jsx("h2",{children:'O Hub: a "central telefônica"'}),e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"Hub"})," é uma classe servidora que define quais métodos os clientes podem chamar e quais métodos o servidor pode chamar de volta nos clientes. É a peça central; pense nela como a operadora de uma central telefônica antiga, conectando ligações."]}),e.jsx("pre",{children:e.jsx("code",{children:`public class ChatHub : Hub
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
}`})}),e.jsxs("p",{children:["Note três alvos diferentes: ",e.jsx("code",{children:"Clients.All"})," (broadcast geral), ",e.jsx("code",{children:'Clients.Group("sala-1")'})," (apenas membros do grupo, ótimo para salas de chat e canais por usuário), e ",e.jsx("code",{children:"Clients.Caller"})," (resposta direcionada apenas ao remetente). Há também ",e.jsx("code",{children:"Clients.Others"}),", ",e.jsx("code",{children:"Clients.User(userId)"})," e ",e.jsx("code",{children:'Clients.Users(new[]{"id1","id2"})'}),"."]}),e.jsxs(a,{type:"info",title:"Hub sem estado",children:["O Hub é instanciado ",e.jsx("strong",{children:"a cada chamada"}),". Não guarde estado em campos privados — eles se perdem na próxima invocação. Para estado compartilhado, use serviços via DI (singleton, banco, cache). Use ",e.jsx("code",{children:"Context.ConnectionId"})," para identificar a conexão entre chamadas."]}),e.jsx("h2",{children:"Cliente JavaScript"}),e.jsx("pre",{children:e.jsx("code",{children:`<script src="https://cdn.jsdelivr.net/npm/@microsoft/signalr/dist/browser/signalr.min.js"><\/script>
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
<\/script>`})}),e.jsxs("p",{children:["Os nomes dos métodos no ",e.jsx("code",{children:"invoke"}),"/",e.jsx("code",{children:"on"})," precisam casar exatamente com o servidor (sem o prefixo do Hub). O ",e.jsx("code",{children:"withAutomaticReconnect"})," faz tentativas escalonadas — útil para Wi-Fi instável. Se a conexão cair definitivamente (servidor reiniciado, por exemplo), você precisa reentrar nos grupos manualmente, porque o servidor perdeu esse mapeamento."]}),e.jsx("h2",{children:"Chamando do servidor sem ser de dentro do Hub"}),e.jsxs("p",{children:["Frequentemente quem precisa empurrar uma notificação é um ",e.jsx("em",{children:"controller"})," ou um job em background. Para isso, peça ",e.jsx("code",{children:"IHubContext<ChatHub>"})," via DI:"]}),e.jsx("pre",{children:e.jsx("code",{children:`public class NotificacaoController : ControllerBase
{
    private readonly IHubContext<ChatHub> _hub;
    public NotificacaoController(IHubContext<ChatHub> hub) => _hub = hub;

    [HttpPost("avisar-todos")]
    public async Task<IActionResult> Avisar(string texto)
    {
        await _hub.Clients.All.SendAsync("RecebeuMensagem", "sistema", texto);
        return Ok();
    }
}`})}),e.jsx("h2",{children:"Escalando horizontalmente: backplane Redis"}),e.jsxs("p",{children:["Quando você tem ",e.jsx("strong",{children:"uma única instância"}),' do servidor, tudo funciona — todas as conexões estão na mesma memória. Mas e quando você roda 3 réplicas atrás de um load balancer? Cliente A conectou na réplica 1, cliente B na réplica 2; se A manda mensagem para o grupo "geral", a réplica 2 não sabe que deveria entregá-la a B. A solução é o ',e.jsx("strong",{children:"backplane"}),": um pub/sub central que sincroniza todas as instâncias."]}),e.jsx("pre",{children:e.jsx("code",{children:`// dotnet add package Microsoft.AspNetCore.SignalR.StackExchangeRedis
builder.Services.AddSignalR().AddStackExchangeRedis(opts =>
{
    opts.Configuration.ChannelPrefix = RedisChannel.Literal("MyApp");
    opts.Configuration.EndPoints.Add("redis:6379");
});`})}),e.jsxs("p",{children:["Cada réplica publica suas mensagens no Redis e ouve as das outras. Para volumes muito altos, há também o ",e.jsx("strong",{children:"Azure SignalR Service"}),", gerenciado, que assume a parte de manter as conexões abertas e lida com milhões de clientes."]}),e.jsxs(a,{type:"warning",title:"WebSocket atrás de proxy",children:["Se você usa Nginx, IIS ou Cloudflare na frente, é preciso habilitar explicitamente o protocolo WebSocket (",e.jsx("code",{children:"proxy_set_header Upgrade $http_upgrade"})," no Nginx). Sem isso, o transporte cai para Long Polling — funciona, mas com mais latência e mais carga no servidor."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Guardar estado em campos do Hub"})," — perdido a cada chamada. Use serviços ou cache."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Esquecer de entrar nos grupos após reconexão"})," — o servidor não memoriza isso."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Operações longas no método do Hub"})," — a conexão fica bloqueada. Despache para um background service e responda depois com ",e.jsx("code",{children:"SendAsync"}),"."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Múltiplas réplicas sem backplane"})," — mensagens chegam só para um pedaço dos usuários."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não tratar ",e.jsx("code",{children:"onclose"})," no cliente"]}),' — UI mostra "conectado" enquanto o servidor caiu.']})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"SignalR negocia WebSocket/SSE/Long Polling automaticamente."}),e.jsxs("li",{children:["Hub é a classe servidora; ",e.jsx("code",{children:"Clients.All/Group/Caller"})," seleciona o destinatário."]}),e.jsx("li",{children:"Hub não guarda estado entre chamadas — use DI."}),e.jsxs("li",{children:["Cliente JS usa ",e.jsx("code",{children:"HubConnectionBuilder"})," com ",e.jsx("code",{children:"withAutomaticReconnect"}),"."]}),e.jsx("li",{children:"Para múltiplas instâncias, use backplane Redis ou Azure SignalR Service."})]})]})}export{i as default};
