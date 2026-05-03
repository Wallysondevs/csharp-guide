import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NativeAotTrimming() {
  return (
    <PageContainer
      title="Native AOT e trimming: binários menores e startup instantâneo"
      subtitle="Compile C# para código nativo, descarte o que não usa e rode sem o overhead do JIT."
      difficulty="avancado"
      timeToRead="17 min"
    >
      <p>
        O modelo tradicional do .NET é <strong>JIT</strong> (Just-In-Time): o seu código vira IL (Intermediate Language) na compilação e o runtime traduz para nativo <em>quando o método é chamado</em>. É flexível e otimiza com base em estatísticas de execução, mas tem custos: o startup é lento (precisa compilar tudo na hora), e o binário leva junto todo o runtime e bibliotecas. <strong>Native AOT</strong> (Ahead-of-Time) inverte: tudo é compilado para nativo na <em>build</em>, gerando um executável standalone sem JIT, sem reflexão dinâmica, sem surpresas. Pense na diferença entre cozinhar a comida do convidado quando ele chega (JIT) e levar marmita pronta (AOT) — segundo é mais rápido de servir, mas você precisou planejar o cardápio antes.
      </p>

      <h2>Quando AOT brilha</h2>
      <p>
        Native AOT faz sentido em três cenários: <strong>(1) AWS Lambda / Functions</strong> com cold start crítico — startup cai de 600ms para 30ms; <strong>(2) ferramentas CLI</strong>, onde o usuário roda e fecha em 100ms (com JIT, esse tempo é dominado pelo runtime carregando); <strong>(3) containers minúsculos</strong>, onde 10MB vs 100MB de imagem fazem diferença em deploy massivo. Para web APIs comuns, JIT continua bom — o startup acontece uma vez e o tier-2 do JIT eventualmente otimiza melhor que AOT.
      </p>

      <h2>Habilitando AOT</h2>
      <pre><code>{`<!-- .csproj -->
<PropertyGroup>
  <OutputType>Exe</OutputType>
  <TargetFramework>net9.0</TargetFramework>
  <PublishAot>true</PublishAot>          <!-- ativa Native AOT -->
  <InvariantGlobalization>true</InvariantGlobalization>  <!-- reduz tamanho -->
  <StripSymbols>true</StripSymbols>
</PropertyGroup>`}</code></pre>
      <pre><code>{`# Publica como executável nativo
dotnet publish -c Release -r linux-x64

# Resultado: bin/Release/net9.0/linux-x64/publish/MeuApp
# (~10–20 MB, sem dependência de runtime instalado)`}</code></pre>

      <h2>O que é trimming</h2>
      <p>
        <strong>Trimming</strong> (ou IL Linker) é o processo de remover, do binário final, classes e métodos que sua aplicação não usa. Funciona como uma análise estática: começando pelo <code>Main</code>, ele segue todas as chamadas e marca o que é alcançável. O resto é cortado. AOT exige trimming porque não dá para compilar o que não vai estar lá. Mas trimming também pode ser usado isoladamente (sem AOT) com <code>&lt;PublishTrimmed&gt;true&lt;/...&gt;</code>.
      </p>
      <pre><code>{`<PublishTrimmed>true</PublishTrimmed>
<TrimMode>full</TrimMode>     <!-- agressivo (recomendado para AOT) -->`}</code></pre>

      <h2>O calcanhar de Aquiles: reflexão</h2>
      <p>
        O analisador estático <em>não consegue ver</em> chamadas como <code>Activator.CreateInstance(Type.GetType("MeuApp.Foo"))</code> — o tipo é descoberto em runtime, por string. O resultado: o tipo pode ser cortado pelo trimming, e seu app explode com <code>TypeLoadException</code>. Bibliotecas que dependem fortemente de reflexão (Newtonsoft.Json, AutoMapper antigo, alguns ORMs) sofrem com AOT.
      </p>
      <pre><code>{`// PROBLEMA — reflexão dinâmica
var t = Type.GetType("MinhaLib.Servico");
var inst = Activator.CreateInstance(t!); // pode falhar em AOT

// SOLUÇÃO 1 — anotar para o trimmer não cortar
[DynamicallyAccessedMembers(DynamicallyAccessedMemberTypes.PublicConstructors)]
class Servico { /* ... */ }

// SOLUÇÃO 2 — preferir source generators
// System.Text.Json com SourceGen é AOT-friendly:
[JsonSerializable(typeof(Pedido))]
public partial class JsonContext : JsonSerializerContext { }
var json = JsonSerializer.Serialize(p, JsonContext.Default.Pedido);`}</code></pre>

      <AlertBox type="info" title="Source generators são o futuro do AOT">
        <strong>Source generators</strong> rodam durante a build e geram código C# que substitui reflexão por chamadas estáticas. <code>System.Text.Json</code>, <code>Regex</code>, <code>LoggerMessage</code>, gRPC, Refit, Mapperly — todos têm versões "source-gen" perfeitas para AOT. Use-as quando puder; ganha tanto em performance quanto em compatibilidade.
      </AlertBox>

      <h2>Limitações práticas</h2>
      <ul>
        <li><strong>Sem <code>Assembly.Load</code> em runtime</strong> — você não pode plugar plugins dinamicamente.</li>
        <li><strong>Sem <code>System.Reflection.Emit</code></strong> — bibliotecas que geram IL na hora (Castle DynamicProxy, alguns mocks) quebram.</li>
        <li><strong>Generics fechados precisam ser conhecidos em build</strong> — se você instancia <code>List&lt;T&gt;</code> com <code>T</code> descoberto em runtime, pode estourar.</li>
        <li><strong>Compilação cruzada complicada</strong>: para gerar binário Linux a partir de Windows, você precisa de <code>--runtime linux-x64</code> + dependências nativas (clang, libs).</li>
      </ul>

      <h2>JIT vs AOT — um comparativo</h2>
      <pre><code>{`Métrica                 JIT padrão        Native AOT
----------------------- ----------------- -----------------
Startup (Hello World)   ~250 ms           ~10 ms
Throughput (web)        Excelente (T2)    Bom (sem inlining
                        com perfis        adaptativo)
Tamanho do binário      80–100 MB         8–25 MB
Memória residente       ~80 MB            ~25 MB
Reflexão arbitrária     OK                Restrita
Plugins via Assembly    OK                Não
Dynamic / DLR           OK                Não
Source generators       Bom               Excelente`}</code></pre>

      <h2>Cenário real: API mínima em AOT</h2>
      <pre><code>{`// Program.cs
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
public partial class AppJsonContext : JsonSerializerContext { }`}</code></pre>

      <p>
        Esse template publicado em <code>linux-x64</code> com AOT gera um binário ~12MB, sobe em &lt;30ms e responde JSON com source generation — sem reflexão. Perfeito para um container distroless.
      </p>

      <AlertBox type="warning" title="Avisos do trimmer não são opcionais">
        Durante <code>dotnet publish</code>, o trimmer emite warnings como <code>IL2026</code> e <code>IL2075</code>. Cada um aponta para um lugar onde algo <em>pode</em> quebrar em runtime. Trate-os como erros: ou anote os tipos, ou substitua a abordagem por uma AOT-friendly. Ignorar é pedir para que o app crashe em produção.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar Newtonsoft.Json</strong> em projeto AOT — substitua por System.Text.Json com source generator.</li>
        <li><strong>EF Core sem precompiled queries</strong> — o EF clássico usa expression trees; verifique compatibilidade AOT por versão.</li>
        <li><strong>Reflexão sobre tipos genéricos abertos</strong> — quase sempre falha; refatore para conhecidos.</li>
        <li><strong>Misturar AOT com hot reload</strong> — não funcionam juntos; AOT é pensado para release.</li>
        <li><strong>Esquecer <code>InvariantGlobalization</code></strong> e levar 50MB de ICU para um binário que não precisa.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Native AOT compila para nativo na build, eliminando o JIT.</li>
        <li>Trimming remove código não usado e é pré-requisito para AOT.</li>
        <li>Reflexão dinâmica é a maior limitação; prefira source generators.</li>
        <li>Brilha em CLI, Lambda, containers pequenos.</li>
        <li>Trate todos os warnings de trimming como erros antes de publicar.</li>
      </ul>
    </PageContainer>
  );
}
