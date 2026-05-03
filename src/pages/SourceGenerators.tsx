import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SourceGenerators() {
  return (
    <PageContainer
      title="Source Generators: gerando código em compile-time"
      subtitle="Como o compilador do C# pode escrever código por você antes mesmo do programa rodar."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Imagine que, em vez de escrever um formulário do governo à mão toda vez, você tivesse um carimbo que preenche os campos repetitivos para você. <strong>Source generators</strong> são exatamente isso para o C#: pequenos programas que rodam <em>durante a compilação</em> e geram código automaticamente, antes de o seu programa virar um executável. O termo "compile-time" significa "no momento em que o compilador transforma seu .cs em IL" (a Intermediate Language do .NET). Isso é o oposto de "runtime" (quando o programa já está rodando).
      </p>
      <p>
        A grande vantagem é eliminar <strong>reflection</strong> em runtime. Reflection é a capacidade de inspecionar tipos e métodos enquanto o programa roda — é poderosa, mas lenta e, pior, incompatível com ambientes que cortam código não usado (como AOT — Ahead-Of-Time compilation, usada em apps mobile e nativos). Source generators substituem essa mágica por código C# de verdade, escrito automaticamente, que o JIT pode otimizar normalmente.
      </p>

      <h2>Roslyn: o compilador que conversa com você</h2>
      <p>
        <strong>Roslyn</strong> é o nome do compilador do C#. Ao contrário de compiladores antigos, Roslyn é uma <em>biblioteca</em>: você pode plugar nele "extensões" que recebem a árvore sintática (AST — Abstract Syntax Tree, a representação em árvore do seu código) e produzem novos arquivos. Source generators são uma dessas extensões.
      </p>
      <pre><code>{`// Estrutura mínima de um projeto de source generator
// MeuGen.csproj
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <LangVersion>latest</LangVersion>
    <EnforceExtendedAnalyzerRules>true</EnforceExtendedAnalyzerRules>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp"
                      Version="4.11.0"
                      PrivateAssets="all" />
  </ItemGroup>
</Project>`}</code></pre>
      <p>
        O alvo é sempre <code>netstandard2.0</code> porque o gerador roda dentro do compilador, que ainda usa essa superfície de API por compatibilidade.
      </p>

      <h2>ISourceGenerator vs IIncrementalGenerator</h2>
      <p>
        A primeira versão da API era <code>ISourceGenerator</code>: simples, mas roda do zero a cada keystroke no editor — terrível para performance. A versão moderna é <code>IIncrementalGenerator</code>, baseada em pipelines reativos: você declara "quando este arquivo mudar, recalcule só esta parte". É como uma planilha do Excel — só a célula afetada recalcula.
      </p>
      <pre><code>{`using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;

[Generator]
public class OlaGerador : IIncrementalGenerator
{
    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        // Filtra: só nos interessam classes com [GerarOla]
        var classesComAtributo = context.SyntaxProvider
            .ForAttributeWithMetadataName(
                "MinhaApp.GerarOlaAttribute",
                predicate: (n, _) => n is ClassDeclarationSyntax,
                transform: (ctx, _) => (ClassDeclarationSyntax)ctx.TargetNode);

        context.RegisterSourceOutput(classesComAtributo, (spc, classe) =>
        {
            var nome = classe.Identifier.Text;
            var codigo = $$"""
                namespace MinhaApp;
                public partial class {{nome}}
                {
                    public string Ola() => "Olá de {{nome}}!";
                }
                """;
            spc.AddSource($"{nome}.g.cs", codigo);
        });
    }
}`}</code></pre>

      <AlertBox type="info" title="Partial: o segredo">
        Source generators só conseguem <em>adicionar</em> arquivos novos, nunca alterar os existentes. Por isso a classe-alvo é declarada como <code>partial</code> — assim o gerador escreve a "outra metade" da classe em um arquivo separado, e o compilador junta tudo.
      </AlertBox>

      <h2>Caso real 1: System.Text.Json com JsonSerializerContext</h2>
      <p>
        Por padrão, <code>System.Text.Json</code> usa reflection para descobrir as propriedades de uma classe e serializá-la. Isso quebra em AOT. A solução: declarar um <em>contexto</em> que o source generator do JSON lê, gerando o código de serialização específico para cada tipo.
      </p>
      <pre><code>{`using System.Text.Json.Serialization;

public record Pessoa(string Nome, int Idade);

// O atributo diz ao gerador: "produza serializadores para Pessoa"
[JsonSerializable(typeof(Pessoa))]
public partial class MeuJsonContext : JsonSerializerContext { }

// Uso — sem reflection, AOT-friendly
var p = new Pessoa("Ana", 30);
string json = JsonSerializer.Serialize(p, MeuJsonContext.Default.Pessoa);
Pessoa? volta = JsonSerializer.Deserialize(json, MeuJsonContext.Default.Pessoa);`}</code></pre>

      <h2>Caso real 2: GeneratedRegex</h2>
      <p>
        Expressões regulares, por padrão, são compiladas em runtime — caro. O atributo <code>[GeneratedRegex]</code> faz o gerador produzir o autômato em compile-time, quase tão rápido quanto código escrito à mão.
      </p>
      <pre><code>{`using System.Text.RegularExpressions;

public partial class Validador
{
    // O método é declarado, mas a implementação é gerada
    [GeneratedRegex(@"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$",
                    RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();

    public static bool EhEmail(string s) => EmailRegex().IsMatch(s);
}`}</code></pre>

      <h2>Caso real 3: LoggerMessage</h2>
      <p>
        Logging com interpolação de string aloca memória até quando o nível está desligado. <code>[LoggerMessage]</code> gera um método tipado, sem alocação, e ainda valida em compile-time se você esqueceu um placeholder.
      </p>
      <pre><code>{`using Microsoft.Extensions.Logging;

public partial class PedidoServico
{
    private readonly ILogger<PedidoServico> _log;
    public PedidoServico(ILogger<PedidoServico> log) => _log = log;

    [LoggerMessage(
        EventId = 1001,
        Level = LogLevel.Warning,
        Message = "Pedido {PedidoId} falhou para cliente {ClienteId}")]
    private partial void LogFalha(long pedidoId, long clienteId);

    public void Processar(long pedidoId, long clienteId)
    {
        // ... lógica ...
        LogFalha(pedidoId, clienteId); // 0 alocações se Warning estiver off
    }
}`}</code></pre>

      <AlertBox type="warning" title="Debug é diferente">
        Como o código é gerado pelo compilador, ele não está visível no seu projeto. No Visual Studio, expanda <em>Dependencies → Analyzers → MeuGen → *.g.cs</em> para inspecionar. No CLI, ative <code>&lt;EmitCompilerGeneratedFiles&gt;true&lt;/EmitCompilerGeneratedFiles&gt;</code> no <code>.csproj</code> para gravar em disco.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>partial</code>:</strong> sem ele, o gerador não pode complementar a classe. O erro aparece como "membro duplicado" ou "método sem corpo".</li>
        <li><strong>Usar <code>ISourceGenerator</code> em projetos novos:</strong> está obsoleto. Sempre use <code>IIncrementalGenerator</code>.</li>
        <li><strong>Targetar <code>net8.0</code> no projeto do gerador:</strong> tem que ser <code>netstandard2.0</code>, ou o compilador rejeita.</li>
        <li><strong>Acreditar que o IDE atualiza sozinho:</strong> às vezes é preciso reiniciar o servidor de linguagem (<em>Restart OmniSharp / Roslyn</em>) após editar o gerador.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Source generators escrevem C# em compile-time, eliminando reflection.</li>
        <li><code>IIncrementalGenerator</code> é a API moderna; usa pipelines reativos.</li>
        <li>Classes-alvo precisam ser <code>partial</code>.</li>
        <li>Casos prontos: <code>JsonSerializerContext</code>, <code>[GeneratedRegex]</code>, <code>[LoggerMessage]</code>.</li>
        <li>Indispensáveis para AOT e performance crítica.</li>
      </ul>
    </PageContainer>
  );
}
