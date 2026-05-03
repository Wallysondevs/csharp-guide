import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Websocket() {
  return (
    <PageContainer
      title={"WebSocket"}
      subtitle={"Comunicação bidirecional sobre HTTP. Realtime sem polling."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// servidor (ASP.NET Core)
app.UseWebSockets();
app.Map("/ws", async (HttpContext ctx) =>
{
    if (!ctx.WebSockets.IsWebSocketRequest) return;
    using var ws = await ctx.WebSockets.AcceptWebSocketAsync();
    var buf = new byte[1024];
    while (ws.State == WebSocketState.Open)
    {
        var r = await ws.ReceiveAsync(buf, default);
        if (r.MessageType == WebSocketMessageType.Close) break;
        await ws.SendAsync(buf.AsMemory(0, r.Count), r.MessageType, r.EndOfMessage, default);
    }
});

// cliente
using var client = new ClientWebSocket();
await client.ConnectAsync(new Uri("ws://localhost:5000/ws"), default);
await client.SendAsync(Encoding.UTF8.GetBytes("oi"), WebSocketMessageType.Text, true, default);`}
      />

      <AlertBox type="info" title={"SignalR"}>
        <p>Pra produção em ASP.NET Core, prefira <strong>SignalR</strong>: faz fallback automático (long polling), agrupamento, broadcast, reconexão.</p>
      </AlertBox>
    </PageContainer>
  );
}
