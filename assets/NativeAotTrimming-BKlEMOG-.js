import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function s(){return e.jsxs(r,{title:"Native AOT e trimming: binários menores e startup instantâneo",subtitle:"Compile C# para código nativo, descarte o que não usa e rode sem o overhead do JIT.",difficulty:"avancado",timeToRead:"17 min",children:[e.jsxs("p",{children:["O modelo tradicional do .NET é ",e.jsx("strong",{children:"JIT"})," (Just-In-Time): o seu código vira IL (Intermediate Language) na compilação e o runtime traduz para nativo ",e.jsx("em",{children:"quando o método é chamado"}),". É flexível e otimiza com base em estatísticas de execução, mas tem custos: o startup é lento (precisa compilar tudo na hora), e o binário leva junto todo o runtime e bibliotecas. ",e.jsx("strong",{children:"Native AOT"})," (Ahead-of-Time) inverte: tudo é compilado para nativo na ",e.jsx("em",{children:"build"}),", gerando um executável standalone sem JIT, sem reflexão dinâmica, sem surpresas. Pense na diferença entre cozinhar a comida do convidado quando ele chega (JIT) e levar marmita pronta (AOT) — segundo é mais rápido de servir, mas você precisou planejar o cardápio antes."]}),e.jsx("h2",{children:"Quando AOT brilha"}),e.jsxs("p",{children:["Native AOT faz sentido em três cenários: ",e.jsx("strong",{children:"(1) AWS Lambda / Functions"})," com cold start crítico — startup cai de 600ms para 30ms; ",e.jsx("strong",{children:"(2) ferramentas CLI"}),", onde o usuário roda e fecha em 100ms (com JIT, esse tempo é dominado pelo runtime carregando); ",e.jsx("strong",{children:"(3) containers minúsculos"}),", onde 10MB vs 100MB de imagem fazem diferença em deploy massivo. Para web APIs comuns, JIT continua bom — o startup acontece uma vez e o tier-2 do JIT eventualmente otimiza melhor que AOT."]}),e.jsx("h2",{children:"Habilitando AOT"}),e.jsx("pre",{children:e.jsx("code",{children:`<!-- .csproj -->
<PropertyGroup>
  <OutputType>Exe</OutputType>
  <TargetFramework>net9.0</TargetFramework>
  <PublishAot>true</PublishAot>          <!-- ativa Native AOT -->
  <InvariantGlobalization>true</InvariantGlobalization>  <!-- reduz tamanho -->
  <StripSymbols>true</StripSymbols>
</PropertyGroup>`})}),e.jsx("pre",{children:e.jsx("code",{children:`# Publica como executável nativo
dotnet publish -c Release -r linux-x64

# Resultado: bin/Release/net9.0/linux-x64/publish/MeuApp
# (~10–20 MB, sem dependência de runtime instalado)`})}),e.jsx("h2",{children:"O que é trimming"}),e.jsxs("p",{children:[e.jsx("strong",{children:"Trimming"})," (ou IL Linker) é o processo de remover, do binário final, classes e métodos que sua aplicação não usa. Funciona como uma análise estática: começando pelo ",e.jsx("code",{children:"Main"}),", ele segue todas as chamadas e marca o que é alcançável. O resto é cortado. AOT exige trimming porque não dá para compilar o que não vai estar lá. Mas trimming também pode ser usado isoladamente (sem AOT) com ",e.jsx("code",{children:"<PublishTrimmed>true</...>"}),"."]}),e.jsx("pre",{children:e.jsx("code",{children:`<PublishTrimmed>true</PublishTrimmed>
<TrimMode>full</TrimMode>     <!-- agressivo (recomendado para AOT) -->`})}),e.jsx("h2",{children:"O calcanhar de Aquiles: reflexão"}),e.jsxs("p",{children:["O analisador estático ",e.jsx("em",{children:"não consegue ver"})," chamadas como ",e.jsx("code",{children:'Activator.CreateInstance(Type.GetType("MeuApp.Foo"))'})," — o tipo é descoberto em runtime, por string. O resultado: o tipo pode ser cortado pelo trimming, e seu app explode com ",e.jsx("code",{children:"TypeLoadException"}),". Bibliotecas que dependem fortemente de reflexão (Newtonsoft.Json, AutoMapper antigo, alguns ORMs) sofrem com AOT."]}),e.jsx("pre",{children:e.jsx("code",{children:`// PROBLEMA — reflexão dinâmica
var t = Type.GetType("MinhaLib.Servico");
var inst = Activator.CreateInstance(t!); // pode falhar em AOT

// SOLUÇÃO 1 — anotar para o trimmer não cortar
[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicConstructors)]
class Servico { /* ... */ }

// SOLUÇÃO 2 — preferir source generators
// System.Text.Json com SourceGen é AOT-friendly:
[JsonSerializable(typeof(Pedido))]
public partial class JsonContext : JsonSerializerContext { }
var json = JsonSerializer.Serialize(p, JsonContext.Default.Pedido);`})}),e.jsxs(o,{type:"info",title:"Source generators são o futuro do AOT",children:[e.jsx("strong",{children:"Source generators"})," rodam durante a build e geram código C# que substitui reflexão por chamadas estáticas. ",e.jsx("code",{children:"System.Text.Json"}),", ",e.jsx("code",{children:"Regex"}),", ",e.jsx("code",{children:"LoggerMessage"}),', gRPC, Refit, Mapperly — todos têm versões "source-gen" perfeitas para AOT. Use-as quando puder; ganha tanto em performance quanto em compatibilidade.']}),e.jsx("h2",{children:"Limitações práticas"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Sem ",e.jsx("code",{children:"Assembly.Load"})," em runtime"]})," — você não pode plugar plugins dinamicamente."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Sem ",e.jsx("code",{children:"System.Reflection.Emit"})]})," — bibliotecas que geram IL na hora (Castle DynamicProxy, alguns mocks) quebram."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Generics fechados precisam ser conhecidos em build"})," — se você instancia ",e.jsx("code",{children:"List<T>"})," com ",e.jsx("code",{children:"T"})," descoberto em runtime, pode estourar."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Compilação cruzada complicada"}),": para gerar binário Linux a partir de Windows, você precisa de ",e.jsx("code",{children:"--runtime linux-x64"})," + dependências nativas (clang, libs)."]})]}),e.jsx("h2",{children:"JIT vs AOT — um comparativo"}),e.jsx("pre",{children:e.jsx("code",{children:`Métrica                 JIT padrão        Native AOT
----------------------- ----------------- -----------------
Startup (Hello World)   ~250 ms           ~10 ms
Throughput (web)        Excelente (T2)    Bom (sem inlining
                        com perfis        adaptativo)
Tamanho do binário      80–100 MB         8–25 MB
Memória residente       ~80 MB            ~25 MB
Reflexão arbitrária     OK                Restrita
Plugins via Assembly    OK                Não
Dynamic / DLR           OK                Não
Source generators       Bom               Excelente`})}),e.jsx("h2",{children:"Cenário real: API mínima em AOT"}),e.jsx("pre",{children:e.jsx("code",{children:`// Program.cs
using System.Text.Json.Serialization;

var builder = WebApplication.CreateSlimBuilder(args); // versão "slim" para AOT
builder.Services.ConfigureHttpJsonOptions(opts =>
    opts.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonContext.Default));

var app = builder.Build();

var todos = app.MapGroup("/todos");
todos.MapGet("/", () => new[] { new Todo(1, "Estudar AOT") });
todos.MapGet("/{id}", (int id) => new Todo(id, "Item " + id));

app.Run();

public record Todo(int Id, string Titulo);

[JsonSerializable(typeof(Todo))]
[JsonSerializable(typeof(Todo[]))]
public partial class AppJsonContext : JsonSerializerContext { }`})}),e.jsxs("p",{children:["Esse template publicado em ",e.jsx("code",{children:"linux-x64"})," com AOT gera um binário ~12MB, sobe em <30ms e responde JSON com source generation — sem reflexão. Perfeito para um container distroless."]}),e.jsxs(o,{type:"warning",title:"Avisos do trimmer não são opcionais",children:["Durante ",e.jsx("code",{children:"dotnet publish"}),", o trimmer emite warnings como ",e.jsx("code",{children:"IL2026"})," e ",e.jsx("code",{children:"IL2075"}),". Cada um aponta para um lugar onde algo ",e.jsx("em",{children:"pode"})," quebrar em runtime. Trate-os como erros: ou anote os tipos, ou substitua a abordagem por uma AOT-friendly. Ignorar é pedir para que o app crashe em produção."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Usar Newtonsoft.Json"})," em projeto AOT — substitua por System.Text.Json com source generator."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"EF Core sem precompiled queries"})," — o EF clássico usa expression trees; verifique compatibilidade AOT por versão."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Reflexão sobre tipos genéricos abertos"})," — quase sempre falha; refatore para conhecidos."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Misturar AOT com hot reload"})," — não funcionam juntos; AOT é pensado para release."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"InvariantGlobalization"})]})," e levar 50MB de ICU para um binário que não precisa."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Native AOT compila para nativo na build, eliminando o JIT."}),e.jsx("li",{children:"Trimming remove código não usado e é pré-requisito para AOT."}),e.jsx("li",{children:"Reflexão dinâmica é a maior limitação; prefira source generators."}),e.jsx("li",{children:"Brilha em CLI, Lambda, containers pequenos."}),e.jsx("li",{children:"Trate todos os warnings de trimming como erros antes de publicar."})]})]})}export{s as default};
