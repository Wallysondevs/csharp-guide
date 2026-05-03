import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Sockets() {
  return (
    <PageContainer
      title={"Sockets TCP/UDP"}
      subtitle={"Camada baixa pra protocolos próprios."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="csharp"
        code={`// TCP server
var listener = new TcpListener(IPAddress.Any, 5000);
listener.Start();
while (true)
{
    var client = await listener.AcceptTcpClientAsync();
    _ = HandleAsync(client);
}

async Task HandleAsync(TcpClient c)
{
    using (c)
    using (var stream = c.GetStream())
    {
        var buf = new byte[1024];
        int n = await stream.ReadAsync(buf);
        await stream.WriteAsync(buf.AsMemory(0, n));
    }
}

// UDP
using var udp = new UdpClient(5001);
var result = await udp.ReceiveAsync();
await udp.SendAsync(result.Buffer, result.Buffer.Length, result.RemoteEndPoint);`}
      />
    </PageContainer>
  );
}
