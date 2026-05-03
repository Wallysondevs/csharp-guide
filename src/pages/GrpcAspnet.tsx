import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GrpcAspnet() {
  return (
    <PageContainer
      title="gRPC em ASP.NET Core"
      subtitle="Comunicação binária, tipada e com streaming bidirecional sobre HTTP/2."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <p>
        REST sobre JSON é o padrão da web — texto, fácil de inspecionar, funciona em qualquer linguagem. Mas tem custos: o JSON é volumoso, parsing é caro, e você não tem garantia formal de tipos. Para comunicação <strong>entre microsserviços</strong>, dentro de um datacenter, o <strong>gRPC</strong> oferece uma alternativa: contratos formais (em <strong>Protocol Buffers</strong>), serialização binária compacta, HTTP/2 para multiplexação e streaming bidirecional. Pense nele como um "telefone direto" entre serviços, com idioma combinado de antemão, em vez de cartas em papel timbrado.
      </p>

      <h2>O contrato em .proto</h2>
      <p>
        Tudo começa por um arquivo <code>.proto</code>: a definição formal da API. Esse arquivo é a "verdade" — gera código tipado em servidor e cliente, em qualquer linguagem suportada (C#, Go, Python, Java, etc.).
      </p>
      <pre><code>{`// Protos/precos.proto
syntax = "proto3";

option csharp_namespace = "MeuApp.Grpc";

service ServicoPreco {
  rpc ObterPreco (PrecoRequest) returns (PrecoReply);
  rpc StreamCotacoes (StreamRequest) returns (stream Cotacao); // server streaming
  rpc EnviarLote (stream ItemPreco) returns (LoteReply);        // client streaming
  rpc Chat (stream Mensagem) returns (stream Mensagem);          // bidirecional
}

message PrecoRequest { string ticker = 1; }
message PrecoReply   { string ticker = 1; double preco = 2; int64 timestamp = 3; }

message StreamRequest { repeated string tickers = 1; }
message Cotacao       { string ticker = 1; double preco = 2; }

message ItemPreco { string ticker = 1; double preco = 2; }
message LoteReply { int32 totalRecebido = 1; }

message Mensagem { string usuario = 1; string texto = 2; }`}</code></pre>
      <p>
        Os números (<code>= 1</code>, <code>= 2</code>) são <strong>tags</strong> de campo no formato binário; uma vez publicado, nunca mude — é como o número de uma casa numa rua, mudar quebra todos os clientes antigos.
      </p>

      <h2>Configuração no servidor</h2>
      <pre><code>{`# .csproj
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.65.0" />
</ItemGroup>
<ItemGroup>
  <Protobuf Include="Protos\\precos.proto" GrpcServices="Server" />
</ItemGroup>`}</code></pre>
      <pre><code>{`// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGrpc(o => o.EnableDetailedErrors = true);

var app = builder.Build();
app.MapGrpcService<PrecoService>();
app.MapGet("/", () => "Use um cliente gRPC.");
app.Run();`}</code></pre>

      <h2>Implementação do serviço</h2>
      <p>
        O gerador cria automaticamente uma classe abstrata <code>ServicoPreco.ServicoPrecoBase</code>; você só herda e sobrescreve. Tudo é assíncrono e usa <code>IAsyncStreamReader</code> / <code>IServerStreamWriter</code> para streams.
      </p>
      <pre><code>{`using Grpc.Core;
using MeuApp.Grpc;

public class PrecoService : ServicoPreco.ServicoPrecoBase
{
    // RPC simples (unary)
    public override Task<PrecoReply> ObterPreco(PrecoRequest req, ServerCallContext ctx)
    {
        return Task.FromResult(new PrecoReply
        {
            Ticker = req.Ticker,
            Preco = Random.Shared.NextDouble() * 100,
            Timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
        });
    }

    // Server streaming: servidor envia muitos, cliente um
    public override async Task StreamCotacoes(StreamRequest req,
        IServerStreamWriter<Cotacao> writer, ServerCallContext ctx)
    {
        while (!ctx.CancellationToken.IsCancellationRequested)
        {
            foreach (var t in req.Tickers)
                await writer.WriteAsync(new Cotacao { Ticker = t, Preco = Random.Shared.NextDouble() * 100 });
            await Task.Delay(1000, ctx.CancellationToken);
        }
    }

    // Client streaming: cliente envia muitos, servidor responde um
    public override async Task<LoteReply> EnviarLote(IAsyncStreamReader<ItemPreco> stream,
        ServerCallContext ctx)
    {
        int total = 0;
        await foreach (var item in stream.ReadAllAsync(ctx.CancellationToken))
        {
            // processar item
            total++;
        }
        return new LoteReply { TotalRecebido = total };
    }

    // Bidirecional
    public override async Task Chat(IAsyncStreamReader<Mensagem> req,
        IServerStreamWriter<Mensagem> resp, ServerCallContext ctx)
    {
        await foreach (var msg in req.ReadAllAsync(ctx.CancellationToken))
            await resp.WriteAsync(new Mensagem { Usuario = "echo", Texto = msg.Texto });
    }
}`}</code></pre>

      <AlertBox type="info" title="Quatro tipos de RPC">
        gRPC suporta: <strong>unary</strong> (request/response simples), <strong>server streaming</strong> (servidor empurra muitas respostas), <strong>client streaming</strong> (cliente envia muitas, servidor responde uma) e <strong>bidirecional</strong> (ambos streamando independentemente). REST/JSON faz só o primeiro nativamente.
      </AlertBox>

      <h2>Cliente em C#</h2>
      <pre><code>{`# No projeto cliente:
<Protobuf Include="Protos\\precos.proto" GrpcServices="Client" />`}</code></pre>
      <pre><code>{`using Grpc.Net.Client;
using MeuApp.Grpc;

using var canal = GrpcChannel.ForAddress("https://localhost:5001");
var client = new ServicoPreco.ServicoPrecoClient(canal);

// Unary
var resp = await client.ObterPrecoAsync(new PrecoRequest { Ticker = "PETR4" });
Console.WriteLine($"{resp.Ticker} = R$ {resp.Preco:F2}");

// Server streaming — consumimos com IAsyncEnumerable
using var streamCall = client.StreamCotacoes(new StreamRequest { Tickers = { "PETR4", "VALE3" } });
await foreach (var c in streamCall.ResponseStream.ReadAllAsync())
    Console.WriteLine($"{c.Ticker}: {c.Preco:F2}");`}</code></pre>

      <h2>Performance vs REST</h2>
      <p>
        Em benchmarks de comunicação interna, gRPC costuma ser <strong>3 a 8x mais rápido</strong> que REST/JSON, principalmente por: (1) protobuf binário ocupa ~1/3 do tamanho de JSON equivalente; (2) HTTP/2 multiplexa várias chamadas em uma conexão TCP, sem head-of-line blocking; (3) parsing protobuf é determinístico e sem alocação de strings. Para tráfego entre microsserviços ou jobs em batch, vale muito.
      </p>

      <h2>Limitações</h2>
      <p>
        Navegadores não falam gRPC nativo — porque dependem de controle de header HTTP/2 e trailers que <code>fetch</code> não expõe. Para usar do browser, você precisa de <strong>gRPC-Web</strong>, uma variante com proxy intermediário (no servidor: <code>app.UseGrpcWeb()</code>; no cliente: lib <code>@grpc/grpc-web</code>). Outra opção moderna é <strong>Connect-RPC</strong>, que define um protocolo gRPC-friendly que roda em fetch.
      </p>
      <pre><code>{`builder.Services.AddGrpc();
app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });
app.MapGrpcService<PrecoService>().EnableGrpcWeb();`}</code></pre>

      <AlertBox type="warning" title="HTTPS obrigatório (com Kestrel)">
        gRPC sobre HTTP/1.1 não funciona em Kestrel sem TLS. Em desenvolvimento, use o cert padrão (<code>dotnet dev-certs https --trust</code>). Em containers Docker, configure HTTP/2 sem TLS via <code>Kestrel:EndpointDefaults:Protocols=Http2</code> apenas para tráfego interno confiável.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Mudar números de tag em .proto</strong> — quebra todos os clientes existentes.</li>
        <li><strong>Adicionar campo obrigatório (proto3 não tem) e esperar valor default</strong> — ints vêm zero, strings vazias.</li>
        <li><strong>Esquecer <code>GrpcServices="Server"</code> ou <code>"Client"</code></strong> — gerador não cria stubs.</li>
        <li><strong>Tentar consumir do browser sem gRPC-Web</strong> — o pre-flight CORS falha.</li>
        <li><strong>Reabrir <code>GrpcChannel</code> a cada chamada</strong> — perde a vantagem de HTTP/2; reuse-o.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>gRPC = Protocol Buffers + HTTP/2 + contratos formais.</li>
        <li>Suporta unary, server streaming, client streaming e bidirecional.</li>
        <li>Performance superior a REST/JSON para tráfego interno.</li>
        <li>Browser precisa de gRPC-Web (proxy de protocolo).</li>
        <li>Tags de campo são imutáveis após publicar — versione com cuidado.</li>
      </ul>
    </PageContainer>
  );
}
