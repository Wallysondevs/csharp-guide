import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RoslynAnalyzers() {
  return (
    <PageContainer
      title="Roslyn analyzers: lint customizado para C#"
      subtitle="Crie regras de qualidade que aparecem como sublinhados vermelhos no editor antes mesmo de você compilar."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <p>
        Imagine ter um colega de trabalho invisível que lê seu código enquanto você digita e diz "ei, aqui você esqueceu o <code>await</code>" ou "essa string deveria estar em um recurso de tradução". Isso é um <strong>analyzer</strong>: um plugin que se conecta ao compilador Roslyn (o compilador do C#) e emite diagnósticos — avisos, erros, sugestões — direto no IDE e no build. Ferramentas como <em>StyleCop</em>, <em>SonarAnalyzer</em> e <em>Microsoft.CodeAnalysis.NetAnalyzers</em> são todas analyzers prontos. Mas o melhor: você pode escrever os seus.
      </p>
      <p>
        O termo <strong>lint</strong> vem dos anos 70 e significa "ferramenta que aponta sujeira em código sem executá-lo". O analyzer roda em <em>compile-time</em> (durante a compilação) e também ao vivo no editor — sem custo nenhum em runtime, porque ele não vai junto do seu app.
      </p>

      <h2>Anatomia de um DiagnosticAnalyzer</h2>
      <p>
        Todo analyzer herda de <code>DiagnosticAnalyzer</code> e declara duas coisas: a <strong>regra</strong> (id, mensagem, severidade) e os <strong>callbacks</strong> que registram o que inspecionar (cada classe? cada método? cada chamada?).
      </p>
      <pre><code>{`using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Diagnostics;
using System.Collections.Immutable;

[DiagnosticAnalyzer(LanguageNames.CSharp)]
public class NaoUseConsoleWriteLineAnalyzer : DiagnosticAnalyzer
{
    private static readonly DiagnosticDescriptor Regra = new(
        id: "EMP001",
        title: "Console.WriteLine proibido em produção",
        messageFormat: "Use ILogger em vez de Console.WriteLine",
        category: "Qualidade",
        defaultSeverity: DiagnosticSeverity.Warning,
        isEnabledByDefault: true,
        description: "Empresa exige uso de ILogger para rastreamento.");

    public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics
        => ImmutableArray.Create(Regra);

    public override void Initialize(AnalysisContext context)
    {
        context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
        context.EnableConcurrentExecution();
        context.RegisterSyntaxNodeAction(Analisar, SyntaxKind.InvocationExpression);
    }

    private static void Analisar(SyntaxNodeAnalysisContext ctx)
    {
        var invocacao = (InvocationExpressionSyntax)ctx.Node;
        if (invocacao.Expression is MemberAccessExpressionSyntax m &&
            m.Name.Identifier.Text == "WriteLine" &&
            m.Expression.ToString() == "Console")
        {
            ctx.ReportDiagnostic(Diagnostic.Create(Regra, invocacao.GetLocation()));
        }
    }
}`}</code></pre>
      <p>
        O <code>id</code> ("EMP001") é o que aparece em mensagens de build e no <code>.editorconfig</code>. Por convenção, prefixos curtos identificam a origem: <em>CA</em> (Microsoft), <em>SA</em> (StyleCop), <em>S</em> (Sonar), e o que você quiser para suas regras internas.
      </p>

      <AlertBox type="info" title="Severidade ajustável">
        <code>DiagnosticSeverity</code> pode ser <code>Hidden</code>, <code>Info</code>, <code>Warning</code> ou <code>Error</code>. Mas o usuário final pode <em>sobrescrever</em> isso via <code>.editorconfig</code> — útil para tornar uma regra mais ou menos rigorosa por projeto.
      </AlertBox>

      <h2>Empacotando como NuGet para distribuir</h2>
      <p>
        A graça do analyzer é instalá-lo via NuGet em todos os projetos da empresa. O <code>.csproj</code> precisa marcar o pacote como <em>analyzer</em> (não como dependência runtime):
      </p>
      <pre><code>{`<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <IsPackable>true</IsPackable>
    <PackageId>MinhaEmpresa.Analyzers</PackageId>
    <Version>1.0.0</Version>
    <DevelopmentDependency>true</DevelopmentDependency>
    <IncludeBuildOutput>false</IncludeBuildOutput>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.CSharp"
                      Version="4.11.0" PrivateAssets="all" />
  </ItemGroup>

  <ItemGroup>
    <None Include="$(OutputPath)$(AssemblyName).dll"
          Pack="true"
          PackagePath="analyzers/dotnet/cs"
          Visible="false" />
  </ItemGroup>
</Project>`}</code></pre>
      <p>
        O caminho <code>analyzers/dotnet/cs</code> é convenção: o NuGet enxerga e ativa o analyzer automaticamente em qualquer projeto que instalar o pacote.
      </p>

      <h2>Configurando severidade com .editorconfig</h2>
      <p>
        Cada equipe pode personalizar o comportamento sem alterar o analyzer. O <code>.editorconfig</code> na raiz do repositório vira a "constituição" de qualidade do projeto:
      </p>
      <pre><code>{`# .editorconfig na raiz do repo
root = true

[*.cs]
# Tornando nossa regra um erro de compilação
dotnet_diagnostic.EMP001.severity = error

# Reduzindo barulho de outra regra
dotnet_diagnostic.CA1822.severity = suggestion

# Suprimindo totalmente em código de teste
[**/Tests/**.cs]
dotnet_diagnostic.EMP001.severity = none`}</code></pre>

      <h2>Code fix providers: do diagnóstico à correção automática</h2>
      <p>
        Um <strong>code fix</strong> é o ícone de lâmpada que aparece no editor com a opção "corrigir automaticamente". Ele complementa o analyzer, oferecendo a transformação:
      </p>
      <pre><code>{`using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CodeActions;
using Microsoft.CodeAnalysis.CodeFixes;
using System.Composition;

[ExportCodeFixProvider(LanguageNames.CSharp), Shared]
public class TrocarConsolePorLoggerFix : CodeFixProvider
{
    public override ImmutableArray<string> FixableDiagnosticIds
        => ImmutableArray.Create("EMP001");

    public override FixAllProvider GetFixAllProvider()
        => WellKnownFixAllProviders.BatchFixer;

    public override async Task RegisterCodeFixesAsync(CodeFixContext context)
    {
        var diag = context.Diagnostics[0];
        context.RegisterCodeFix(
            CodeAction.Create(
                title: "Substituir por _logger.LogInformation",
                createChangedDocument: ct => SubstituirAsync(context.Document, diag, ct),
                equivalenceKey: "EMP001-fix"),
            diag);
    }
    // ... implementação omitida ...
    private static Task<Document> SubstituirAsync(Document d, Diagnostic _, CancellationToken __)
        => Task.FromResult(d); // placeholder didático
}`}</code></pre>

      <h2>Instalando analyzers prontos</h2>
      <p>
        Antes de escrever seus próprios, vale instalar os clássicos:
      </p>
      <pre><code>{`# StyleCop: regras de estilo de código
dotnet add package StyleCop.Analyzers

# Microsoft NetAnalyzers (já vem com .NET 8+, mas pode ser atualizado)
dotnet add package Microsoft.CodeAnalysis.NetAnalyzers

# SonarAnalyzer: bugs e code smells
dotnet add package SonarAnalyzer.CSharp

# Roslynator: refatorações e fixes adicionais
dotnet add package Roslynator.Analyzers`}</code></pre>

      <AlertBox type="warning" title="Não exagere na severidade">
        Marcar todas as regras como <code>error</code> parece rigoroso, mas trava o trabalho em código legado. Comece com <code>warning</code>, vá promovendo para <code>error</code> conforme o time corrige. Use <code>&lt;TreatWarningsAsErrors&gt;true&lt;/TreatWarningsAsErrors&gt;</code> só na CI, não no dia a dia.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Targetar <code>net8.0</code> no projeto do analyzer:</strong> deve ser <code>netstandard2.0</code>, ou o compilador rejeita carregar.</li>
        <li><strong>Não chamar <code>EnableConcurrentExecution</code>:</strong> o analyzer ainda funciona, mas perde paralelismo em projetos grandes.</li>
        <li><strong>Esquecer <code>ConfigureGeneratedCodeAnalysis</code>:</strong> sem isso, o analyzer reclama em código gerado por outras ferramentas.</li>
        <li><strong>IDs colidindo com regras existentes:</strong> use prefixo único da empresa (ex.: <code>ACME001</code>).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Analyzers são plugins do compilador Roslyn que emitem diagnósticos.</li>
        <li>Distribuídos como NuGet em <code>analyzers/dotnet/cs</code>.</li>
        <li><code>.editorconfig</code> ajusta severidade por projeto/pasta.</li>
        <li>Code fix providers transformam diagnóstico em correção automática.</li>
        <li>StyleCop, SonarAnalyzer e Roslynator são opções prontas valiosas.</li>
      </ul>
    </PageContainer>
  );
}
