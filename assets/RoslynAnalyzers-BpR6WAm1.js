import{j as e}from"./index-CzLAthD5.js";import{P as r,A as o}from"./AlertBox-CWJo3ar5.js";function i(){return e.jsxs(r,{title:"Roslyn analyzers: lint customizado para C#",subtitle:"Crie regras de qualidade que aparecem como sublinhados vermelhos no editor antes mesmo de você compilar.",difficulty:"avancado",timeToRead:"13 min",children:[e.jsxs("p",{children:['Imagine ter um colega de trabalho invisível que lê seu código enquanto você digita e diz "ei, aqui você esqueceu o ',e.jsx("code",{children:"await"}),'" ou "essa string deveria estar em um recurso de tradução". Isso é um ',e.jsx("strong",{children:"analyzer"}),": um plugin que se conecta ao compilador Roslyn (o compilador do C#) e emite diagnósticos — avisos, erros, sugestões — direto no IDE e no build. Ferramentas como ",e.jsx("em",{children:"StyleCop"}),", ",e.jsx("em",{children:"SonarAnalyzer"})," e ",e.jsx("em",{children:"Microsoft.CodeAnalysis.NetAnalyzers"})," são todas analyzers prontos. Mas o melhor: você pode escrever os seus."]}),e.jsxs("p",{children:["O termo ",e.jsx("strong",{children:"lint"}),' vem dos anos 70 e significa "ferramenta que aponta sujeira em código sem executá-lo". O analyzer roda em ',e.jsx("em",{children:"compile-time"})," (durante a compilação) e também ao vivo no editor — sem custo nenhum em runtime, porque ele não vai junto do seu app."]}),e.jsx("h2",{children:"Anatomia de um DiagnosticAnalyzer"}),e.jsxs("p",{children:["Todo analyzer herda de ",e.jsx("code",{children:"DiagnosticAnalyzer"})," e declara duas coisas: a ",e.jsx("strong",{children:"regra"})," (id, mensagem, severidade) e os ",e.jsx("strong",{children:"callbacks"})," que registram o que inspecionar (cada classe? cada método? cada chamada?)."]}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.CodeAnalysis;
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
}`})}),e.jsxs("p",{children:["O ",e.jsx("code",{children:"id"}),' ("EMP001") é o que aparece em mensagens de build e no ',e.jsx("code",{children:".editorconfig"}),". Por convenção, prefixos curtos identificam a origem: ",e.jsx("em",{children:"CA"})," (Microsoft), ",e.jsx("em",{children:"SA"})," (StyleCop), ",e.jsx("em",{children:"S"})," (Sonar), e o que você quiser para suas regras internas."]}),e.jsxs(o,{type:"info",title:"Severidade ajustável",children:[e.jsx("code",{children:"DiagnosticSeverity"})," pode ser ",e.jsx("code",{children:"Hidden"}),", ",e.jsx("code",{children:"Info"}),", ",e.jsx("code",{children:"Warning"})," ou ",e.jsx("code",{children:"Error"}),". Mas o usuário final pode ",e.jsx("em",{children:"sobrescrever"})," isso via ",e.jsx("code",{children:".editorconfig"})," — útil para tornar uma regra mais ou menos rigorosa por projeto."]}),e.jsx("h2",{children:"Empacotando como NuGet para distribuir"}),e.jsxs("p",{children:["A graça do analyzer é instalá-lo via NuGet em todos os projetos da empresa. O ",e.jsx("code",{children:".csproj"})," precisa marcar o pacote como ",e.jsx("em",{children:"analyzer"})," (não como dependência runtime):"]}),e.jsx("pre",{children:e.jsx("code",{children:`<Project Sdk="Microsoft.NET.Sdk">
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
</Project>`})}),e.jsxs("p",{children:["O caminho ",e.jsx("code",{children:"analyzers/dotnet/cs"})," é convenção: o NuGet enxerga e ativa o analyzer automaticamente em qualquer projeto que instalar o pacote."]}),e.jsx("h2",{children:"Configurando severidade com .editorconfig"}),e.jsxs("p",{children:["Cada equipe pode personalizar o comportamento sem alterar o analyzer. O ",e.jsx("code",{children:".editorconfig"}),' na raiz do repositório vira a "constituição" de qualidade do projeto:']}),e.jsx("pre",{children:e.jsx("code",{children:`# .editorconfig na raiz do repo
root = true

[*.cs]
# Tornando nossa regra um erro de compilação
dotnet_diagnostic.EMP001.severity = error

# Reduzindo barulho de outra regra
dotnet_diagnostic.CA1822.severity = suggestion

# Suprimindo totalmente em código de teste
[**/Tests/**.cs]
dotnet_diagnostic.EMP001.severity = none`})}),e.jsx("h2",{children:"Code fix providers: do diagnóstico à correção automática"}),e.jsxs("p",{children:["Um ",e.jsx("strong",{children:"code fix"}),' é o ícone de lâmpada que aparece no editor com a opção "corrigir automaticamente". Ele complementa o analyzer, oferecendo a transformação:']}),e.jsx("pre",{children:e.jsx("code",{children:`using Microsoft.CodeAnalysis;
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
}`})}),e.jsx("h2",{children:"Instalando analyzers prontos"}),e.jsx("p",{children:"Antes de escrever seus próprios, vale instalar os clássicos:"}),e.jsx("pre",{children:e.jsx("code",{children:`# StyleCop: regras de estilo de código
dotnet add package StyleCop.Analyzers

# Microsoft NetAnalyzers (já vem com .NET 8+, mas pode ser atualizado)
dotnet add package Microsoft.CodeAnalysis.NetAnalyzers

# SonarAnalyzer: bugs e code smells
dotnet add package SonarAnalyzer.CSharp

# Roslynator: refatorações e fixes adicionais
dotnet add package Roslynator.Analyzers`})}),e.jsxs(o,{type:"warning",title:"Não exagere na severidade",children:["Marcar todas as regras como ",e.jsx("code",{children:"error"})," parece rigoroso, mas trava o trabalho em código legado. Comece com ",e.jsx("code",{children:"warning"}),", vá promovendo para ",e.jsx("code",{children:"error"})," conforme o time corrige. Use ",e.jsx("code",{children:"<TreatWarningsAsErrors>true</TreatWarningsAsErrors>"})," só na CI, não no dia a dia."]}),e.jsx("h2",{children:"Erros comuns"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsxs("strong",{children:["Targetar ",e.jsx("code",{children:"net8.0"})," no projeto do analyzer:"]})," deve ser ",e.jsx("code",{children:"netstandard2.0"}),", ou o compilador rejeita carregar."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Não chamar ",e.jsx("code",{children:"EnableConcurrentExecution"}),":"]})," o analyzer ainda funciona, mas perde paralelismo em projetos grandes."]}),e.jsxs("li",{children:[e.jsxs("strong",{children:["Esquecer ",e.jsx("code",{children:"ConfigureGeneratedCodeAnalysis"}),":"]})," sem isso, o analyzer reclama em código gerado por outras ferramentas."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"IDs colidindo com regras existentes:"})," use prefixo único da empresa (ex.: ",e.jsx("code",{children:"ACME001"}),")."]})]}),e.jsx("h2",{children:"Resumo"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Analyzers são plugins do compilador Roslyn que emitem diagnósticos."}),e.jsxs("li",{children:["Distribuídos como NuGet em ",e.jsx("code",{children:"analyzers/dotnet/cs"}),"."]}),e.jsxs("li",{children:[e.jsx("code",{children:".editorconfig"})," ajusta severidade por projeto/pasta."]}),e.jsx("li",{children:"Code fix providers transformam diagnóstico em correção automática."}),e.jsx("li",{children:"StyleCop, SonarAnalyzer e Roslynator são opções prontas valiosas."})]})]})}export{i as default};
