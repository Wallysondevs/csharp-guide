import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ProjetoGrpc() {
  return (
    <PageContainer
      title={"Projeto: serviço gRPC"}
      subtitle={"Service-to-service com contrato em proto e cliente tipado."}
      difficulty={"avancado"}
      timeToRead={"5 min"}
    >
      <CodeBlock
        language="bash"
        code={`dotnet new grpc -o MeuGrpc
dotnet new grpc-client -o ClienteGrpc`}
      />

      <p>Define o contrato no .proto, build gera classes C# de servidor (abstract base) e cliente (auto-gerado). Servidor implementa, cliente consome — type-safe e binário.</p>

      <CodeBlock
        language="csharp"
        code={`// servidor
public class CalcSvc : Calc.CalcBase
{
    public override Task<Resp> Somar(Req req, ServerCallContext _)
        => Task.FromResult(new Resp { Resultado = req.A + req.B });
}

// cliente
using var ch = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Calc.CalcClient(ch);
var r = await client.SomarAsync(new Req { A = 5, B = 3 });
Console.WriteLine(r.Resultado);   // 8`}
      />
    </PageContainer>
  );
}
