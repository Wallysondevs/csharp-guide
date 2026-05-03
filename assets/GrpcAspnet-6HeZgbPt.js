import{j as e}from"./index-CzLAthD5.js";import{P as o,A as r}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(o,{title:"gRPC em ASP.NET Core",subtitle:"Comunicação binária, tipada e com streaming bidirecional sobre HTTP/2.",difficulty:"avancado",timeToRead:"18 min",children:[e.jsxs("p",{children:["REST sobre JSON é o padrão da web — texto, fácil de inspecionar, funciona em qualquer linguagem. Mas tem custos: o JSON é volumoso, parsing é caro, e você não tem garantia formal de tipos. Para comunicação ",e.jsx("strong",{children:"entre microsserviços"}),", dentro de um datacenter, o ",e.jsx("strong",{children:"gRPC"})," oferece uma alternativa: contratos formais (em ",e.jsx("strong",{children:"Protocol Buffers"}),'), serialização binária compacta, HTTP/2 para multiplexação e streaming bidirecional. Pense nele como um "telefone direto" entre serviços, com idioma combinado de antemão, em vez de cartas em papel timbrado.']}),e.jsx("h2",{children:"O contrato em .proto"}),e.jsxs("p",{children:["Tudo começa por um arquivo ",e.jsx("code",{children:".proto"}),': a definição formal da API. Esse arquivo é a "verdade" — gera código tipado em servidor e cliente, em qualquer linguagem suportada (C#, Go, Python, Java, etc.).']}),e.jsx("pre",{children:e.jsx("code",{children:`// Protos/precos.proto
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

message Mensagem { string usuario = 1; string texto = 2; }`})}),e.jsxs("p",{children:["Os números (",e.jsx("code",{children:"= 1"}),", ",e.jsx("code",{children:"= 2"}),") são ",e.jsx("strong",{children:"tags"})," de campo no formato binário; uma vez publicado, nunca mude — é como o número de uma casa numa rua, mudar quebra todos os clientes antigos."]}),e.jsx("h2",{children:"Configuração no servidor"}),e.jsx("pre",{children:e.jsx("code",{children:`# .csproj
<ItemGroup>
  <PackageReference Include="Grpc.AspNetCore" Version="2.65.0" />
</ItemGroup>
<ItemGroup>
  <Protobuf Include="Protos\\precos.proto" GrpcServices="Server" />
</ItemGroup>`})}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddGrpc(o => o.EnableDetailedErrors = true);

var app = builder.Build();
app.MapGrpcService<PrecoService>();
app.MapGet("/", () => "Use um cliente gRPC.");
app.Run();`})}),e.jsx("h2",{children:"Implementação do serviço"}),e.jsxs("p",{children:["O gerador cria automaticamente uma classe abstrata ",e.jsx("code",{children:"ServicoPreco.ServicoPrecoBase"}),"; você só herda e sobrescreve. Tudo é assíncrono e usa ",e.jsx("code",{children:"IAsyncStreamReader"})," / ",e.jsx("code",{children:"IServerStreamWriter"})," para streams."]}),e.jsx("pre",{children:e.jsx("code",{children:`using Grpc.Core;
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
}`})}),e.jsxs(r,{type:"info",title:"Quatro tipos de RPC",children:["gRPC suporta: ",e.jsx("strong",{children:"unary"})," (request/response simples), ",e.jsx("strong",{children:"server streaming"})," (servidor empurra muitas respostas), ",e.jsx("strong",{children:"client streaming"})," (cliente envia muitas, servidor responde uma) e ",e.jsx("strong",{children:"bidirecional"})," (ambos streamando independentemente). REST/JSON faz só o primeiro nativamente."]}),e.jsx("h2",{children:"Cliente em C#"}),e.jsx("pre",{children:e.jsx("code",{children:`# No projeto cliente:
<Protobuf Include="Protos\\precos.proto" GrpcServices="Client" />`})}),e.jsx("pre",{children:e.jsx("code",{children:`using Grpc.Net.Client;
using MeuApp.Grpc;

using var canal = GrpcChannel.ForAddress("https://localhost:5001");
var client = new ServicoPreco.ServicoPrecoClient(canal);

// Unary
var resp = await client.ObterPrecoAsync(new PrecoRequest { Ticker = "PETR4" });
Console.WriteLine($"{resp.Ticker} = R$ {resp.Preco:F2}");

// Server streaming — consumimos com IAsyncEnumerable
using var streamCall = client.StreamCotacoes(new StreamRequest { Tickers = { "PETR4", "VALE3" } });
await foreach (var c in streamCall.ResponseStream.ReadAllAsync())
    Console.WriteLine($"{c.Ticker}: {c.Preco:F2}");`})}),e.jsx("h2",{children:"Performance vs REST"}),e.jsxs("p",{children:["Em benchmarks de comunicação interna, gRPC costuma ser ",e.jsx("strong",{children:"3 a 8x mais rápido"})," que REST/JSON, principalmente por: (1) protobuf binário ocupa ~1/3 do tamanho de JSON equivalente; (2) HTTP/2 multiplexa várias chamadas em uma conexão TCP, sem head-of-line blocking; (3) parsing protobuf é determinístico e sem alocação de strings. Para tráfego entre microsserviços ou jobs em batch, vale muito."]}),e.jsx("h2",{children:"Limitações"}),e.jsxs("p",{children:["Navegadores não falam gRPC nativo — porque dependem de controle de header HTTP/2 e trailers que ",e.jsx("code",{children:"fetch"})," não expõe. Para usar do browser, você precisa de ",e.jsx("strong",{children:"gRPC-Web"}),", uma variante com proxy intermediário (no servidor: ",e.jsx("code",{children:"app.UseGrpcWeb()"}),"; no cliente: lib ",e.jsx("code",{children:"@grpc/grpc-web"}),"). Outra opção moderna é ",e.jsx("strong",{children:"Connect-RPC"}),", que define um protocolo gRPC-friendly que roda em fetch."]}),e.jsx("pre",{children:e.jsx("code",{children:`builder.Services.AddGrpc();
app.UseGrpcWeb(new GrpcWebOptions { DefaultEnabled = true });
app.MapGrpcService<PrecoService>().EnableGrpcWeb();`})}),e.jsxs(r,{type:"warning",title:"HTTPS obrigatório (com Kestrel)",children:["gRPC sobre HTTP/1.1 não funciona em Kestrel sem TLS. Em desenvolvimento, use o cert padrão (",e.jsx("code",{children:"dotnet dev-certs https --trust"}),"). Em containers Docker, configure HTTP/2 sem TLS via ",e.jsx("code",{children:"Kestrel:EndpointDefaults:Protocols=Http2"})," apenas para tráfego interno confiável."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Mudar números de tag em .proto"})," — quebra todos os clientes existentes."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Adicionar campo obrigatório (proto3 não tem) e esperar valor default"})," — ints vêm zero, strings vazias."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:'GrpcServices="Server"'})," ou ",e.jsx("code",{children:'"Client"'})]})," — gerador não cria stubs."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Tentar consumir do browser sem gRPC-Web"})," — o pre-flight CORS falha."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Reabrir ",e.jsx("code",{children:"GrpcChannel"})," a cada chamada"]})," — perde a vantagem de HTTP/2; reuse-o."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"gRPC = Protocol Buffers + HTTP/2 + contratos formais."}),e.jsx("li",{children:"Suporta unary, server streaming, client streaming e bidirecional."}),e.jsx("li",{children:"Performance superior a REST/JSON para tráfego interno."}),e.jsx("li",{children:"Browser precisa de gRPC-Web (proxy de protocolo)."}),e.jsx("li",{children:"Tags de campo são imutáveis após publicar — versione com cuidado."})]})]})}export{i as default};
