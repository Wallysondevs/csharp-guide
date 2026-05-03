import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Grpc() {
  return (
    <PageContainer
      title={"gRPC"}
      subtitle={"RPC binário, multiplexado, com contrato em .proto. Mais rápido que JSON pra service-to-service."}
      difficulty={"avancado"}
      timeToRead={"6 min"}
    >
      <CodeBlock
        language="protobuf"
        title="saudacao.proto"
        code={`syntax = "proto3";
service Saudacao {
    rpc Cumprimentar (PessoaReq) returns (SaudacaoResp);
}
message PessoaReq { string nome = 1; }
message SaudacaoResp { string mensagem = 1; }`}
      />

      <h2>Servidor (.NET)</h2>

      <CodeBlock
        language="csharp"
        code={`public class SaudacaoSvc : Saudacao.SaudacaoBase
{
    public override Task<SaudacaoResp> Cumprimentar(PessoaReq req, ServerCallContext ctx)
        => Task.FromResult(new SaudacaoResp { Mensagem = $"Olá {req.Nome}" });
}

// Program.cs
builder.Services.AddGrpc();
app.MapGrpcService<SaudacaoSvc>();`}
      />

      <h2>Cliente</h2>

      <CodeBlock
        language="csharp"
        code={`using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Saudacao.SaudacaoClient(channel);
var resp = await client.CumprimentarAsync(new PessoaReq { Nome = "Ana" });
Console.WriteLine(resp.Mensagem);`}
      />
    </PageContainer>
  );
}
